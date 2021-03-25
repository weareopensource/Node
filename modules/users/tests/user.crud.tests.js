/**
 * Module dependencies.
 */
const request = require('supertest');
const path = require('path');
const _ = require('lodash');

const express = require(path.resolve('./lib/services/express'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));
const multerService = require(path.resolve('./lib/services/multer'));

/**
 * Unit tests
 */
describe('User CRUD Tests :', () => {
  let UserService = null;
  let app;
  let agent;
  let credentials;
  let user;
  let userEdited;
  let _user;
  let _userEdited;

  //  init
  beforeAll(async () => {
    try {
      // init mongo
      await mongooseService.connect();
      await multerService.storage();
      await mongooseService.loadModels();
      UserService = require(path.resolve('./modules/users/services/user.service'));
      // init application
      app = express.init();
      agent = request.agent(app);
    } catch (err) {
      console.log(err);
    }
  });

  /**
   * User routes tests
   */
  describe('Logged', () => {
    beforeEach(async () => {
      // users credentials
      credentials = [
        {
          email: 'test@test.com',
          password: 'W@os.jsI$Aw3$0m3',
        },
        {
          email: 'test2@test.com',
          password: 'W@os.jsI$Aw3$0m3',
        },
      ];

      // users
      _user = {
        firstName: 'Full',
        lastName: 'Name',
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

    test('should not be able to register a new user with weak password', async () => {
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

    test('if should not be able to register, should not return sensible data', async () => {
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

    test('should be able to register a new user ', async () => {
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
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to register a user with same email', async () => {
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
        expect(result.body.description).toBe('Path `email` (register_new_user_@test.com) is not unique. .');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to login with wrong email', async () => {
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

    test('should be able to login with email successfully', async () => {
      try {
        await agent.post('/api/auth/signin').send(credentials[0]).expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to retrieve a list of users if not admin', async () => {
      try {
        await agent.get('/api/users').expect(403);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to retrieve a list of users if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get('/api/users').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user list');
        expect(result.body.data).toBeInstanceOf(Array);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to retrieve a list of users if admin with pagination', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get('/api/users/page/0').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user list');
        expect(result.body.data).toBeInstanceOf(Array);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get('/api/users/page/0&1').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user list');
        expect(result.body.data).toBeInstanceOf(Array);
        expect(result.body.data).toHaveLength(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get('/api/users/page/1&1').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user list');
        expect(result.body.data).toBeInstanceOf(Array);
        expect(result.body.data).toHaveLength(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to retrieve a list of users if admin with pagination and search', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get('/api/users/page/0&20&Admin').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user list');
        expect(result.body.data).toBeInstanceOf(Array);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get a single user details if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get(`/api/users/${userEdited._id}`).expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user get');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data._id).toBe(String(userEdited._id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to update a single user details if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const userUpdate = {
          firstName: 'admin_update_first',
          lastName: 'admin_update_last',
          roles: ['admin'],
        };

        const result = await agent.put(`/api/users/${userEdited._id}`).send(userUpdate).expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user updated');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data.firstName).toBe('admin_update_first');
        expect(result.body.data.lastName).toBe('admin_update_last');
        expect(result.body.data.roles).toBeInstanceOf(Array);
        expect(result.body.data.roles).toHaveLength(1);
        expect(result.body.data.roles).toEqual(expect.arrayContaining(['admin']));
        expect(result.body.data._id).toBe(String(userEdited._id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to delete a single user if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.delete(`/api/users/${userEdited._id}`).expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user deleted');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data.id).toBe(String(userEdited._id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password should return 400 for non-existent mail', async () => {
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

    test('forgot password should return 422 for no email provided', async () => {
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
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password should return 400 for non-local provider set for the user object', async () => {
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
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password should be able to reset password for user password reset request', async () => {
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

    test('forgot password should be able to reset the password using reset token', async () => {
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

    test('forgot password should return error when using invalid reset token', async () => {
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

    test('should be able to change user own password successfully', async () => {
      try {
        const result = await agent
          .post('/api/users/password')
          .send({
            newPassword: 'WeAreOpenSource$&2',
            verifyPassword: 'WeAreOpenSource$&2',
            currentPassword: credentials[0].password,
          })
          .expect(200);
        expect(result.body.message).toBe('Password changed successfully');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change user own password if wrong verifyPassword is given', async () => {
      try {
        const result = await agent
          .post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890-ABC-123-Aa$',
            currentPassword: credentials[0].password,
          })
          .expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Passwords do not match');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change user own password if wrong currentPassword is given', async () => {
      try {
        const result = await agent
          .post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'some_wrong_passwordAa$',
          })
          .expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Current password is incorrect');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change user own password if no new password is at all given', async () => {
      try {
        const result = await agent
          .post('/api/users/password')
          .send({
            newPassword: '',
            verifyPassword: '',
            currentPassword: credentials[0].password,
          })
          .expect(400);
        expect(result.body.message).toEqual('Bad Request');
        expect(result.body.description).toBe('Please provide a new password');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change user own password successfully if new password is too easy', async () => {
      try {
        const result = await agent
          .post('/api/users/password')
          .send({
            newPassword: 'OpenSource',
            verifyPassword: 'OpenSource',
            currentPassword: credentials[0].password,
          })
          .expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Password too weak.');
        expect(JSON.parse(result.body.error).details).toBeInstanceOf(Array);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get own user details successfully', async () => {
      try {
        const result = await agent.get('/api/users/me').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user get');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data.email).toBe(user.email);
        expect(result.body.data.password).toBeFalsy();
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get all user data successfully', async () => {
      try {
        const result = await agent.get('/api/users/data').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user data');
        expect(result.body.data.user.id).toBe(user.id);
        expect(result.body.data.tasks).toBeInstanceOf(Array);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to update own user details', async () => {
      const userUpdate = {
        firstName: 'userUpdateFirst',
        lastName: 'userUpdateLast',
      };

      try {
        const result = await agent.put('/api/users').send(userUpdate).expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user updated');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data.firstName).toBe('userUpdateFirst');
        expect(result.body.data.lastName).toBe('userUpdateLast');
        expect(result.body.data.roles).toBeInstanceOf(Array);
        expect(result.body.data.roles).toHaveLength(1);
        expect(result.body.data.roles).toEqual(expect.arrayContaining(['user']));
        expect(result.body.data.id).toBe(String(user.id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to update Terms sign date if logged in', async () => {
      try {
        const result = await agent.get('/api/users/terms').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user terms signed');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update own user details and add roles if not admin', async () => {
      const userUpdate = {
        firstName: 'userUpdateFirst',
        lastName: 'userUpdateLast',
        roles: ['user', 'admin'],
      };
      try {
        const result = await agent.put('/api/users').send(userUpdate).expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user updated');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(result.body.data.firstName).toBe('userUpdateFirst');
        expect(result.body.data.lastName).toBe('userUpdateLast');
        expect(result.body.data.roles).toBeInstanceOf(Array);
        expect(result.body.data.roles).toHaveLength(1);
        expect(result.body.data.roles).toEqual(expect.arrayContaining(['user']));
        expect(result.body.data.id).toBe(String(user.id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update own user details with existing email', async () => {
      try {
        const result = await agent.post('/api/auth/signup').send(_userEdited).expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const userUpdate = {
          firstName: _userEdited.firstName,
          lastName: _userEdited.lastName,
          email: _user.email,
        };

        const result = await agent.put('/api/users').send(userUpdate).expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Path `email` (test@test.com) is not unique. .');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update secure fields', async () => {
      try {
        const userUpdate = {
          firstName: 'adminUpdateFirst',
          lastName: 'adminUpdateLast',
          password: 'Aw3$0m3P@sswordWaos',
          created: new Date(2000, 9, 9),
          resetPasswordToken: 'tweeked-reset-token',
        };

        await agent.put('/api/users').send(userUpdate).expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await UserService.get(user);

        expect(result.password).toBe(user.password);
        expect(result.createdAt.getTime()).toBe(new Date(user.createdAt).getTime());
        expect(result.resetPasswordToken).toBeFalsy();
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to delete current user', async () => {
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

      // delete user
      try {
        const result = await agent.delete('/api/users').expect(200);

        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user deleted');
        expect(result.body.data.id).toBe(userEdited.id);
        expect(result.body.data.deletedCount).toBe(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to delete current user and all his data', async () => {
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

      // delete user
      try {
        const result = await agent.delete('/api/users/data').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('user and his data were deleted');
        expect(result.body.data.id).toBe(userEdited.id);
        expect(result.body.data.user.deletedCount).toBe(1);
        expect(result.body.data.tasks.deletedCount).toBe(0);
        expect(result.body.data.uploads.deletedCount).toBe(0);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to change profile avatar if signed in', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/default.png').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('profile avatar updated');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(typeof result.body.data.avatar).toBe('string');
        expect(result.body.data.id).toBe(String(user.id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change profile avatar if attach a avatar with a different field name', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('fieldThatDoesntWork', './modules/users/tests/img/default.png').expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toEqual('Unexpected field.');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to upload a non-image file as a profile avatar', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/text-file.txt').expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toEqual('Only image/png,image/jpeg,image/jpg,image/gif images allowed.');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change profile avatar to too big of a file', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/too-big-file.png').expect(422);

        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toEqual('File too large.');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    afterEach(async () => {
      // del user
      try {
        await UserService.delete(user);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('Logout', () => {
    test('should not be able to update Terms sign date if not logged in', async () => {
      try {
        await agent.get('/api/users/terms').expect(401);
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should not be able to change user own password if not signed in', async () => {
      try {
        await agent
          .post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'W@os.jsI$Aw3$0m3',
          })
          .expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should not be able to get any user details if not logged in', async () => {
      try {
        await agent.get('/api/users/me').expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should not be able to update own user details if not logged-in', async () => {
      try {
        const userUpdate = {
          firstName: 'user_update_first',
          lastName: 'user_update_last',
        };

        await agent.put('/api/users').send(userUpdate).expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should not be able to update own user profile avatar without being logged-in', async () => {
      try {
        await agent.post('/api/users/avatar').send({}).expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should be able to get a users stats', async () => {
      try {
        const result = await agent.get('/api/users/stats').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('users stats');
      } catch (err) {
        expect(err).toBeFalsy();
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
