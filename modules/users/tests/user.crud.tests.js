/**
 * Module dependencies.
 */
const request = require('supertest');
const path = require('path');
const _ = require('lodash');

const express = require(path.resolve('./lib/services/express'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));

/**
 * Unit tests
 */
describe('User CRUD Unit Tests :', () => {
  let UserService = null;

  // Mongoose init
  beforeAll(() => mongooseService.connect()
    .then(() => {
      mongooseService.loadModels();
      UserService = require('../services/user.service');
    })
    .catch((e) => {
      console.log(e);
    }));


  // Globals
  let app;

  let agent;
  let credentials;
  let user;
  let userEdited;
  let _user;
  let _userEdited;

  /**
 * User routes tests
 */
  describe('User CRUD logged', () => {
    beforeAll((done) => {
    // Get application
      app = express.init();
      agent = request.agent(app);

      done();
    });

    beforeEach(async () => {
    // users credentials
      credentials = [{
        email: 'test@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      }, {
        email: 'test2@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      }];

      // users
      _user = {
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        username: 'test',
        email: credentials[0].email,
        password: credentials[0].password,
        provider: 'local',
      };
      _userEdited = _.clone(_user);
      _userEdited.username = 'test2';
      _userEdited.email = credentials[1].email;
      _userEdited.password = credentials[1].password;

      // add user
      try {
        const result = await agent.post('/api/auth/signup')
          .send(_user)
          .expect(200);
        user = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to register a new user', async () => {
      // Init user edited
      _userEdited.username = 'register_new_user';
      _userEdited.email = 'register_new_user_@test.com';

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;

        expect(result.body.user.username).toBe(_userEdited.username);
        expect(result.body.user.email).toBe(_userEdited.email);
        expect(result.body.user.roles).toBeInstanceOf(Array);
        expect(result.body.user.roles).toHaveLength(1);
        expect(result.body.user.roles).toEqual(
          expect.arrayContaining(['user']),
        );
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


    test('should be able to login with username successfully', async () => {
      try {
        await agent.post('/api/auth/signin')
          .send(credentials[0])
          .expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to retrieve a list of users if not admin', async () => {
      try {
        await agent.get('/api/users')
          .send(credentials[0])
          .expect(403);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });


    test('should be able to get a single user details if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.get(`/api/users/${userEdited._id}`)
          .expect(200);
        expect(result.body).toBeInstanceOf(Object);
        expect(result.body._id).toBe(String(userEdited._id));
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
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
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

        const result = await agent.put(`/api/users/${userEdited._id}`)
          .send(userUpdate)
          .expect(200);
        expect(result.body).toBeInstanceOf(Object);
        expect(result.body.firstName).toBe('admin_update_first');
        expect(result.body.lastName).toBe('admin_update_last');
        expect(result.body.roles).toBeInstanceOf(Array);
        expect(result.body.roles).toHaveLength(1);
        expect(result.body.roles).toEqual(
          expect.arrayContaining(['admin']),
        );
        expect(result.body._id).toBe(String(userEdited._id));
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
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.delete(`/api/users/${userEdited._id}`)
          .expect(200);
        expect(result.body).toBeInstanceOf(Object);
        expect(result.body._id).toBe(String(userEdited._id));
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
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: 'falseemail@gmail.com',
          })
          .expect(400);

        expect(result.body.message).toBe('No account with that email has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('forgot password should return 422 for no email provided', async () => {
      _userEdited.provider = 'facebook';

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: '',
          })
          .expect(422);
        expect(result.body.message).toBe('Mail field must not be blank');
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
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: userEdited.email,
          })
          .expect(400);
        expect(result.body.message).toBe(`It seems like you signed up using your ${userEdited.provider} account`);
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
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        expect(result.body.message).toBe('Failure sending email');
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
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        expect(result.body.message).toBe('Failure sending email');
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
          const result2 = await agent.get(`/api/auth/reset/${result.resetPasswordToken}`)
            .expect(302);
          expect(result2.headers.location).toBe(`/password/reset/${result.resetPasswordToken}`);
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
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        expect(result.body.message).toBe('Failure sending email');
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
          const result2 = await agent.get(`/api/auth/reset/${invalidToken}`)
            .expect(302);
          expect(result2.headers.location).toBe('/password/reset/invalid');
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
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
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
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890-ABC-123-Aa$',
            currentPassword: credentials[0].password,
          })
          .expect(422);
        expect(result.body.message).toBe('Passwords do not match');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change user own password if wrong currentPassword is given', async () => {
      try {
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'some_wrong_passwordAa$',
          })
          .expect(422);
        expect(result.body.message).toBe('Current password is incorrect');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change user own password if no new password is at all given', async () => {
      try {
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '',
            verifyPassword: '',
            currentPassword: credentials[0].password,
          })
          .expect(422);
        expect(result.body.message).toBe('Please provide a new password');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get own user details successfully', async () => {
      try {
        const result = await agent.get('/api/users/me')
          .expect(200);
        expect(result.body).toBeInstanceOf(Object);
        expect(result.body.username).toBe(user.username);
        expect(result.body.email).toBe(user.email);
        expect(result.body.salt).toBeFalsy();
        expect(result.body.password).toBeFalsy();
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to update own user details', async () => {
      const userUpdate = {
        firstName: 'user_update_first',
        lastName: 'user_update_last',
      };

      try {
        const result = await agent.put('/api/users')
          .send(userUpdate)
          .expect(200);

        expect(result.body).toBeInstanceOf(Object);
        expect(result.body.firstName).toBe('user_update_first');
        expect(result.body.lastName).toBe('user_update_last');
        expect(result.body.roles).toBeInstanceOf(Array);
        expect(result.body.roles).toHaveLength(1);
        expect(result.body.roles).toEqual(
          expect.arrayContaining(['user']),
        );
        expect(result.body.id).toBe(String(user.id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update own user details and add roles if not admin', async () => {
      const userUpdate = {
        firstName: 'user_update_first',
        lastName: 'user_update_last',
        roles: ['user', 'admin'],
      };
      try {
        const result = await agent.put('/api/users')
          .send(userUpdate)
          .expect(200);
        expect(result.body).toBeInstanceOf(Object);
        expect(result.body.firstName).toBe('user_update_first');
        expect(result.body.lastName).toBe('user_update_last');
        expect(result.body.roles).toBeInstanceOf(Array);
        expect(result.body.roles).toHaveLength(1);
        expect(result.body.roles).toEqual(
          expect.arrayContaining(['user']),
        );
        expect(result.body.id).toBe(String(user.id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update own user details with existing username', async () => {
      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const userUpdate = {
          firstName: _userEdited.firstName,
          lastName: _userEdited.lastName,
          username: _user.username,
        };

        const result = await agent.put('/api/users')
          .send(userUpdate)
          .expect(422);
        expect(result.body.message).toBe('Username already exists');
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

    test('should not be able to update own user details with existing email', async () => {
      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
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

        const result = await agent.put('/api/users')
          .send(userUpdate)
          .expect(422);
        expect(result.body.message).toBe('Email already exists');
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
          firstName: 'admin_update_first',
          lastName: 'admin_update_last',
          password: 'Aw3$0m3P@sswordWaos',
          created: new Date(2000, 9, 9),
          resetPasswordToken: 'tweeked-reset-token',
        };

        await agent.put('/api/users')
          .send(userUpdate)
          .expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }


      try {
        const result = await UserService.get(user);

        expect(result.password).toBe(user.password);
        expect(result.created.getTime()).toBe(new Date(user.created).getTime());
        expect(result.resetPasswordToken).toBeFalsy();
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to change profile picture if signed in', async () => {
      try {
        const result = await agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/img/default.png')
          .expect(200);

        expect(result.body).toBeInstanceOf(Object);
        expect(typeof result.body.profileImageURL).toBe('string');
        expect(result.body.id).toBe(String(user.id));
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change profile picture if attach a picture with a different field name', async () => {
      try {
        await agent.post('/api/users/picture')
          .attach('fieldThatDoesntWork', './modules/users/tests/img/default.png')
          .expect(422);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to upload a non-image file as a profile picture', async () => {
      try {
        await agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/img/text-file.txt')
          .expect(422);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to change profile picture to too big of a file', async () => {
      try {
        await agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/img/too-big-file.png')
          .expect(422);
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

  describe('User CRUD logout', () => {
    beforeAll((done) => {
    // Get application
      app = express.init();
      agent = request.agent(app);

      done();
    });

    test('should not be able to change user own password if not signed in', async () => {
      try {
        await agent.post('/api/users/password')
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
        await agent.get('/api/users/me')
          .expect(401);
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

        await agent.put('/api/users')
          .send(userUpdate)
          .expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should not be able to update own user profile picture without being logged-in', async () => {
      try {
        await agent.post('/api/users/picture')
          .send({})
          .expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });
  });

  // Mongoose disconnect
  afterAll(() => mongooseService.disconnect()
    .catch((e) => {
      console.log(e);
    }));
});
