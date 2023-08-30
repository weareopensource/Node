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
describe('User account CRUD Tests :', () => {
  let UserService = null;
  let agent;
  let credentials;
  let user;
  let userEdited;
  let _user;
  let _userEdited;

  //  init
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
  describe('Logged', () => {
    beforeEach(async () => {
      // users credentials
      credentials = [
        {
          email: 'account@test.com',
          password: 'W@os.jsI$Aw3$0m3',
        },
        {
          email: 'account2@test.com',
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

    test('should be able to change user own password successfully', async () => {
      try {
        const result = await agent
          .post('/api/users/password')
          .send({
            newPassword: 'Waos.azs@^:SA3$&2',
            verifyPassword: 'Waos.azs@^:SA3$&2',
            currentPassword: credentials[0].password,
          })
          .expect(200);
        expect(result.body.message).toBe('Password changed successfully');
      } catch (err) {
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
        expect(result.body.description).toBe('Email already exists.');
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

    test('should be able to remove current user', async () => {
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

    test('should be able to remove current user and all his data', async () => {
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
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/default.jpeg').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('profile avatar updated');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(typeof result.body.data.avatar).toBe('string');
        expect(result.body.data.id).toBe(String(user.id));
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change profile avatar if attach a avatar with a different field name', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('fieldThatDoesntWork', './modules/users/tests/img/default.jpeg').expect(422);
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
        expect(result.body.description).toEqual('Only image/png,image/jpeg,image/jpg,image/gif files allowed.');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change profile avatar to too big of a file', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/default-big.jpeg').expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toEqual('Only files lower than 0.05mo are allowed.');
      } catch (err) {
        console.log('toto', err);
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

  describe('Logout', () => {
    test('should not be able to update Terms sign date if not logged in', async () => {
      try {
        await agent.get('/api/users/terms').expect(401);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
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
