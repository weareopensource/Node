/**
 * Module dependencies.
 */
const chai = require('chai');
const request = require('supertest');
const path = require('path');
const _ = require('lodash');

const express = require(path.resolve('./lib/services/express'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));

const should = chai.should();

/**
 * Unit tests
 */
describe('User CRUD Unit Tests :', () => {
  let UserService = null;

  // Mongoose init
  before(() => mongooseService.connect()
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
    before((done) => {
    // Get application
      app = express.init();
      agent = request.agent(app);

      done();
    });

    beforeEach(async () => {
    // Create user credentials with username
      credentials = [{
        email: 'test@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      }, {
        email: 'test2@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      }];

      // Create a new user
      _user = {
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        username: 'test',
        email: credentials[0].email,
        password: credentials[0].password,
        provider: 'local',
      };

      // Init user edited
      _userEdited = _.clone(_user);
      _userEdited.username = 'test2';
      _userEdited.email = credentials[1].email;
      _userEdited.password = credentials[1].password;

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_user)
          .expect(200);
        user = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to register a new user', async () => {
      // Init user edited
      _userEdited.username = 'register_new_user';
      _userEdited.email = 'register_new_user_@test.com';

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;

        result.body.user.username.should.equal(_userEdited.username);
        result.body.user.email.should.equal(_userEdited.email);
        result.body.user.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        result.body.user.roles.indexOf('user').should.equal(0);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });


    it('should be able to login with username successfully', async () => {
      try {
        await agent.post('/api/auth/signin')
          .send(credentials[0])
          .expect(200);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to retrieve a list of users if not admin', async () => {
      try {
        await agent.get('/api/users')
          .send(credentials[0])
          .expect(403);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });


    it('should be able to get a single user details if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await agent.get(`/api/users/${userEdited._id}`)
          .expect(200);
        result.body.should.be.instanceof(Object);
        result.body._id.should.be.equal(String(userEdited._id));
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to update a single user details if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
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
        result.body.should.be.instanceof(Object);
        result.body.firstName.should.be.equal('admin_update_first');
        result.body.lastName.should.be.equal('admin_update_last');
        result.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        result.body._id.should.be.equal(String(userEdited._id));
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to delete a single user if admin', async () => {
      _userEdited.roles = ['user', 'admin'];

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await agent.delete(`/api/users/${userEdited._id}`)
          .expect(200);
        result.body.should.be.instanceof(Object);
        result.body._id.should.be.equal(String(userEdited._id));
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('forgot password should return 400 for non-existent mail', async () => {
      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: 'falseemail@gmail.com',
          })
          .expect(400);

        result.body.message.should.equal('No account with that email has been found');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('forgot password should return 422 for no email provided', async () => {
      // edit
      _userEdited.provider = 'facebook';

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: '',
          })
          .expect(422);
        result.body.message.should.equal('Mail field must not be blank');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('forgot password should return 400 for non-local provider set for the user object', async () => {
      // edit
      _userEdited.provider = 'facebook';

      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: userEdited.email,
          })
          .expect(400);
        result.body.message.should.equal(`It seems like you signed up using your ${userEdited.provider} account`);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('forgot password should be able to reset password for user password reset request', async () => {
      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        result.body.message.should.be.equal('Failure sending email');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await UserService.get({
          email: user.email,
        });
        result.should.be.an('object');
        should.exist(result.resetPasswordToken);
        should.exist(result.resetPasswordExpires);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('forgot password should be able to reset the password using reset token', async () => {
      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        result.body.message.should.be.equal('Failure sending email');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await UserService.get({
          email: user.email,
        });
        result.should.be.an('object');
        should.exist(result.resetPasswordToken);
        should.exist(result.resetPasswordExpires);

        try {
          const result2 = await agent.get(`/api/auth/reset/${result.resetPasswordToken}`)
            .expect(302);
          result2.headers.location.should.be.equal(`/password/reset/${result.resetPasswordToken}`);
        } catch (err) {
          console.log(err);
          should.not.exist(err);
        }
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('forgot password should return error when using invalid reset token', async () => {
      try {
        const result = await agent.post('/api/auth/forgot')
          .send({
            email: user.email,
          })
          .expect(400);
        result.body.message.should.be.equal('Failure sending email');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        const result = await UserService.get({
          email: user.email,
        });
        result.should.be.an('object');
        should.exist(result.resetPasswordToken);
        should.exist(result.resetPasswordExpires);

        try {
          const invalidToken = 'someTOKEN1234567890';
          const result2 = await agent.get(`/api/auth/reset/${invalidToken}`)
            .expect(302);
          result2.headers.location.should.be.equal('/password/reset/invalid');
        } catch (err) {
          console.log(err);
          should.not.exist(err);
        }
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to change user own password successfully', async () => {
      try {
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: credentials[0].password,
          })
          .expect(200);
        result.body.message.should.equal('Password changed successfully');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to change user own password if wrong verifyPassword is given', async () => {
      try {
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890-ABC-123-Aa$',
            currentPassword: credentials[0].password,
          });
        result.body.message.should.equal('Passwords do not match');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to change user own password if wrong currentPassword is given', async () => {
      try {
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'some_wrong_passwordAa$',
          });
        result.body.message.should.equal('Current password is incorrect');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to change user own password if no new password is at all given', async () => {
      try {
        const result = await agent.post('/api/users/password')
          .send({
            newPassword: '',
            verifyPassword: '',
            currentPassword: credentials[0].password,
          });
        result.body.message.should.equal('Please provide a new password');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to get own user details successfully', async () => {
      try {
        const result = await agent.get('/api/users/me')
          .expect(200);
        result.body.should.be.instanceof(Object);
        result.body.username.should.equal(user.username);
        result.body.email.should.equal(user.email);
        should.not.exist(result.body.salt);
        should.not.exist(result.body.password);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to update own user details', async () => {
      const userUpdate = {
        firstName: 'user_update_first',
        lastName: 'user_update_last',
      };

      try {
        const result = await agent.put('/api/users')
          .send(userUpdate)
          .expect(200);

        result.body.should.be.instanceof(Object);
        result.body.firstName.should.be.equal('user_update_first');
        result.body.lastName.should.be.equal('user_update_last');
        result.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        result.body.roles.indexOf('user').should.equal(0);
        result.body.id.should.be.equal(String(user.id));
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to update own user details and add roles if not admin', async () => {
      const userUpdate = {
        firstName: 'user_update_first',
        lastName: 'user_update_last',
        roles: ['user', 'admin'],
      };

      try {
        const result = await agent.put('/api/users')
          .send(userUpdate)
          .expect(200);
        result.body.should.be.instanceof(Object);
        result.body.firstName.should.be.equal('user_update_first');
        result.body.lastName.should.be.equal('user_update_last');
        result.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
        result.body.roles.indexOf('user').should.equal(0);
        result.body.id.should.be.equal(String(user.id));
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to update own user details with existing username', async () => {
      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
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
        result.body.message.should.equal('Username already exists');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to update own user details with existing email', async () => {
      try {
        const result = await agent.post('/api/auth/signup')
          .send(_userEdited)
          .expect(200);
        userEdited = result.body.user;
      } catch (err) {
        console.log(err);
        should.not.exist(err);
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
        result.body.message.should.equal('Email already exists');
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }

      try {
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to update secure fields', async () => {
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
        should.not.exist(err);
      }


      try {
        const result = await UserService.get(user);

        result.password.should.be.equal(user.password);
        result.created.getTime().should.be.equal(new Date(user.created).getTime());
        should.not.exist(result.resetPasswordToken);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should be able to change profile picture if signed in', async () => {
      try {
        const result = await agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/img/default.png')
          .expect(200);

        result.body.should.be.instanceof(Object);
        result.body.profileImageURL.should.be.a('string');
        result.body.id.should.be.equal(String(user.id));
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to change profile picture if attach a picture with a different field name', async () => {
      try {
        await agent.post('/api/users/picture')
          .attach('fieldThatDoesntWork', './modules/users/tests/img/default.png')
          .expect(422);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to upload a non-image file as a profile picture', async () => {
      try {
        await agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/img/text-file.txt')
          .expect(422);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    it('should not be able to change profile picture to too big of a file', async () => {
      try {
        await agent.post('/api/users/picture')
          .attach('newProfilePicture', './modules/users/tests/img/too-big-file.png')
          .expect(422);
      } catch (err) {
        console.log(err);
        should.not.exist(err);
      }
    });

    afterEach(async () => {
      try {
        await UserService.remove(user);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('User CRUD logout', () => {
    before((done) => {
    // Get application
      app = express.init();
      agent = request.agent(app);

      done();
    });

    it('should not be able to change user own password if not signed in', async () => {
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
        should.not.exist(err);
        console.log(err);
      }
    });

    it('should not be able to get any user details if not logged in', async () => {
      try {
        await agent.get('/api/users/me')
          .expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        should.not.exist(err);
        console.log(err);
      }
    });

    it('should not be able to update own user details if not logged-in', async () => {
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
        should.not.exist(err);
        console.log(err);
      }
    });

    it('should not be able to update own user profile picture without being logged-in', async () => {
      try {
        await agent.post('/api/users/picture')
          .send({})
          .expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        should.not.exist(err);
        console.log(err);
      }
    });
  });

  // Mongoose disconnect
  after(() => mongooseService.disconnect()
    .catch((e) => {
      console.log(e);
    }));
});
