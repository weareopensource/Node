/**
 * Module dependencies.
 */
import request from 'supertest';
import path from 'path';
import _ from 'lodash';

import { bootstrap } from '../../../lib/app.js';
import mongooseService from '../../../lib/services/mongoose.js';

/**
 * Unit tests
 */
describe('Auth integration tests:', () => {
  let UserService = null;
  let agent;
  let credentials;
  let user;
  let userEdited;
  let _user;
  let _userEdited;

  //  init
  beforeAll(async () => {
    try {
      const init = await bootstrap();
      UserService = (await import(path.resolve('./modules/users/services/users.service.js'))).default;
      agent = request.agent(init.app);
    } catch (err) {
      console.log(err);
    }
  });

  /**
   * User routes tests
   */
  describe('Registration', () => {
    beforeEach(async () => {
      // users credentials
      credentials = [
        {
          email: 'auth@test.com',
          password: 'W@os.jsI$Aw3$0m3',
        },
        {
          email: 'auth2@test.com',
          password: 'W@os.jsI$Aw3$0m3',
        },
      ];

      // users
      _user = {
        firstName: 'First',
        lastName: 'Last',
        email: credentials[0].email,
        password: credentials[0].password,
        provider: 'local',
      };
      _userEdited = _.clone(_user);
      _userEdited.email = credentials[1].email;
      _userEdited.password = credentials[1].password;

      // add user
      try {
        const result = await agent.post('/api/auth/signup').send(_user).expect(200);
        user = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should reject registration with weak password', async () => {
      // Init user edited
      _userEdited.email = 'register_new_user_@test.com';
      _userEdited.password = 'azerty';

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(422);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Schema validation error');
        expect(result.body.description).toEqual('Password must have a strength of at least 3. Password length must be at least 8 characters long. ');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not return sensitive data on registration failure', async () => {
      // Init user edited
      _userEdited.email = 'register_new_user_@test.com';
      _userEdited.password = 'azerty';

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(422);

        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Schema validation error');
        expect(result.body.description).toEqual('Password must have a strength of at least 3. Password length must be at least 8 characters long. ');
        expect(JSON.parse(result.body.error)._original.password).toBeUndefined();
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should successfully register a new user', async () => {
      // Init user edited
      _userEdited.email = 'register_new_user_@test.com';

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;

        expect(result.body.user._id).toBe(result.body.user.id);
        expect(result.body.user.email).toBe(_userEdited.email);
        expect(result.body.user.provider).toBe('local');
        expect(result.body.user.roles).toBeInstanceOf(Array);
        expect(result.body.user.roles).toHaveLength(1);
        expect(result.body.user.roles).toEqual(expect.arrayContaining(['user']));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should reject registration with duplicate email', async () => {
      // Init user edited
      _userEdited.email = 'register_new_user_@test.com';

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
        expect(result.body.user.email).toBe(_userEdited.email);
        expect(result.body.user.roles).toBeInstanceOf(Array);
        expect(result.body.user.roles).toHaveLength(1);
        expect(result.body.user.roles).toEqual(expect.arrayContaining(['user']));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(422);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Email already exists.');
      } catch (err) {
        expect(err).toBeFalsy();
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should reject login with incorrect email', async () => {
      try {
        const result = await agent
          .post('/api/auth/signin')
          .send({
            email: 'test51@test.com',
            password: 'W@os.jsI$Aw3$0m3',
          })
          .expect(401);
        expect(result.error.text).toBe('Unauthorized');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should successfully login with correct email', async () => {
      try {
        await agent.post('/api/auth/signin').send(credentials[0]).expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password request should return 400 for non-existent email', async () => {
      try {
        const result = await agent
          .post('/api/auth/forgot')
          .send({
            email: 'falseemail@gmail.com',
          })
          .expect(400);

        expect(result.body.message).toBe('Bad Request');
        expect(result.body.description).toBe('No account with that email has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password request should return 422 for empty email', async () => {
      _userEdited.provider = 'facebook';

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent
          .post('/api/auth/forgot')
          .send({
            email: '',
          })
          .expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Mail field must not be blank');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password request should return 400 for non-local provider', async () => {
      _userEdited.provider = 'facebook';

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent
          .post('/api/auth/forgot')
          .send({
            email: userEdited.email,
          })
          .expect(400);
        expect(result.body.message).toBe('Bad Request');
        expect(result.body.description).toBe(`It seems like you signed up using your ${userEdited.provider} account`);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should initiate password reset for valid email', async () => {
      try {
        const result = await agent
          .post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        expect(result.body.message).toBe('Bad Request');
        expect(result.body.description).toBe('Failure sending email');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await UserService.get({
          email: user.email,
        });
        expect(typeof result).toBe('object');
        expect(result.resetPasswordToken).toBeDefined();
        expect(result.resetPasswordExpires).toBeDefined();
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should allow password reset using valid reset token', async () => {
      try {
        const result = await agent
          .post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);

        expect(result.body.message).toBe('Bad Request');
        expect(result.body.description).toBe('Failure sending email');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await UserService.get({
          email: user.email,
        });
        expect(typeof result).toBe('object');
        expect(result.resetPasswordToken).toBeDefined();
        expect(result.resetPasswordExpires).toBeDefined();

        try {
          const result2 = await agent.get(`/api/auth/reset/${result.resetPasswordToken}`).expect(302);
          expect(result2.headers.location).toBe(`/api/password/reset/${result.resetPasswordToken}`);
        } catch (err) {
          console.log(err);
          expect(err).toBeFalsy();
        }
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should reject password reset using invalid reset token', async () => {
      try {
        const result = await agent
          .post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);

        expect(result.body.message).toBe('Bad Request');
        expect(result.body.description).toBe('Failure sending email');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await UserService.get({
          email: user.email,
        });
        expect(typeof result).toBe('object');
        expect(result.resetPasswordToken).toBeDefined();
        expect(result.resetPasswordExpires).toBeDefined();

        try {
          const invalidToken = 'someTOKEN1234567890';
          const result2 = await agent.get(`/api/auth/reset/${invalidToken}`).expect(302);
          expect(result2.headers.location).toBe('/api/password/reset/invalid');
        } catch (err) {
          console.log(err);
          expect(err).toBeFalsy();
        }
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    afterEach(async () => {
      // del user
      try {
        await UserService.remove(user);
      } catch (err) {
        console.log(err);
      }
    });
  });

  // Mongoose disconnect
  afterAll(async () => {
    try {
      await mongooseService.disconnect();
    } catch (err) {
      console.log(err);
    }
  });
});
