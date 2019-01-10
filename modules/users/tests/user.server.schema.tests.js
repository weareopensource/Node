/**
 * Module dependencies.
 */
const chai = require('chai');
const path = require('path');
const Joi = require('joi');

const config = require(path.resolve('./config'));
const schema = require('../models/user.server.schema');

const should = chai.should();


// Globals
let user;
// let user2;
// let user3;

/**
 * Unit tests
 */
describe('User Schema Unit Tests:', () => {
  before(() => {
    user = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local',
    };
    // user2 is a clone of user
    // user2 = user;
    // user3 = {
    //   firstName: 'Different',
    //   lastName: 'User',
    //   displayName: 'Full Different Name',
    //   email: 'test3@test.com',
    //   username: 'different_username',
    //   password: 'Different_Password1!',
    //   provider: 'local',
    // };
  });

  describe('Schema Save', () => {
    it('should be valid a user example without problems', (done) => {
      const _user = { ...user };

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    // it('should fail to save an existing user again', (done) => {
    //   const _user = new User(user);
    //   const _user2 = new User(user2);

    //   _user.save(() => {
    //     _user2.save((err) => {
    //       should.exist(err);
    //       _user.remove((err) => {
    //         should.not.exist(err);
    //         done();
    //       });
    //     });
    //   });
    // });

    it('should be able to show an error when trying a schema without first name', (done) => {
      const _user = { ...user };
      _user.firstName = '';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should be able to accept a user with valid roles without problems', (done) => {
      const _user = { ...user };
      _user.roles = ['user', 'admin'];

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should be able to show an error when trying a user without a role', (done) => {
      const _user = { ...user };
      _user.roles = [];

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should be able to show an error when trying to update an existing user with a invalid role', (done) => {
      const _user = { ...user };
      _user.roles = ['invalid-user-role-enum'];

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    //   it('should confirm that saving user model doesnt change the password', (done) => {
    //     const _user = new User(user);

    //     _user.save((err) => {
    //       should.not.exist(err);
    //       const passwordBefore = _user.password;
    //       _user.firstName = 'test';
    //       _user.save(() => {
    //         const passwordAfter = _user.password;
    //         passwordBefore.should.equal(passwordAfter);
    //         _user.remove((err) => {
    //           should.not.exist(err);
    //           done();
    //         });
    //       });
    //     });
    //   });

    //   it('should be able to save 2 different users', (done) => {
    //     const _user = new User(user);
    //     const _user3 = new User(user3);

    //     _user.save((err) => {
    //       should.not.exist(err);
    //       _user3.save((err) => {
    //         should.not.exist(err);
    //         _user3.remove((err) => {
    //           should.not.exist(err);
    //           _user.remove((err) => {
    //             should.not.exist(err);
    //             done();
    //           });
    //         });
    //       });
    //     });
    //   });

    //   it('should not be able to save another user with the same email address', (done) => {
    //   // Test may take some time to complete due to db operations

    //     const _user = new User(user);
    //     const _user3 = new User(user3);

    //     _user.save((err) => {
    //       should.not.exist(err);
    //       _user3.email = _user.email;
    //       _user3.save((err) => {
    //         should.exist(err);
    //         _user.remove((err) => {
    //           should.not.exist(err);
    //           done();
    //         });
    //       });
    //     });
    //   });

    //   it('should not save the password in plain text', (done) => {
    //     const _user = new User(user);
    //     const passwordBeforeSave = _user.password;
    //     _user.save((err) => {
    //       should.not.exist(err);
    //       _user.password.should.not.equal(passwordBeforeSave);
    //       _user.remove((err) => {
    //         should.not.exist(err);
    //         done();
    //       });
    //     });
    //   });

    //   it('should not save the passphrase in plain text', (done) => {
    //     const _user = new User(user);
    //     _user.password = 'Open-Source Full-Stack Solution for MEAN';
    //     const passwordBeforeSave = _user.password;
    //     _user.save((err) => {
    //       should.not.exist(err);
    //       _user.password.should.not.equal(passwordBeforeSave);
    //       _user.remove((err) => {
    //         should.not.exist(err);
    //         done();
    //       });
    //     });
    //   });
  });

  describe('User Password Validation Tests', () => {
    it('should validate when the password strength passes - "P-@-$-$-w-0-r-d-!"', (done) => {
      const _user = { ...user };
      _user.password = 'P-@-$-$-w-0-r-d-!';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should validate when the password is undefined', (done) => {
      const _user = { ...user };
      _user.password = undefined;

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow a difficult password with a score of 4 with zxcvbn- "WeAreOpenSource"', (done) => {
      const _user = { ...user };
      _user.password = 'Open-Source Stack Solution For WeAreOpenSource Applications';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow a password with a score of 3 with zxcvbn- "AreOpenSource"', (done) => {
      const _user = { ...user };
      _user.password = 'AreOpenSource';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should not allow a password with a score of 2 with zxcvbn- "OpenSource"', (done) => {
      const _user = { ...user };
      _user.password = 'OpenSource';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow a simple password with a score of 1 with zxcvbn- "Source"', (done) => {
      const _user = { ...user };
      _user.password = 'Source';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });


    it('should not allow this simple password - "P@$$w0rd!"', (done) => {
      const _user = { ...user };
      _user.password = 'P@$$w0rd!';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow a password greater than 128 characters long.', (done) => {
      const _user = { ...user };
      _user.password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });


    it('should not allow a password with 3 or more repeating characters - "P@$$w0rd!!!"', (done) => {
      const _user = { ...user };
      _user.password = 'P@$$w0rd!!!';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });
  });

  describe('User E-mail Validation Tests', () => {
    it('should not allow invalid email address - "123"', (done) => {
      const _user = { ...user };
      _user.email = '123';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow invalid email address - "123@123@123"', (done) => {
      const _user = { ...user };
      _user.email = '123@123@123';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow invalid email address - "123.com"', (done) => {
      const _user = { ...user };
      _user.email = '123.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow invalid email address - "@123.com"', (done) => {
      const _user = { ...user };
      _user.email = '@123.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow invalid email address - "abc@abc@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc@abc@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow invalid characters in email address - "abc~@#$%^&*()ef=@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc~@#$%^&*()ef=@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow space characters in email address - "abc def@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc def@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    /* eslint no-useless-escape: 0 */
    it('should not allow doudble quote characters in email address - "abc\"def@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc\"def@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should not allow double dotted characters in email address - "abcdef@abc..com"', (done) => {
      const _user = { ...user };
      _user.email = 'abcdef@abc..com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should allow single quote characters in email address - "abc\'def@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc\'def@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow valid email address - "abc@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow valid email address - "abc+def@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc+def@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow valid email address - "abc.def@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc.def@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow valid email address - "abc.def@abc.def.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc.def@abc.def.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });

    it('should allow valid email address - "abc-def@abc.com"', (done) => {
      const _user = { ...user };
      _user.email = 'abc-def@abc.com';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });
  });

  describe('Username Validation', () => {
    it('should show error to valid username beginning with .', (done) => {
      const _user = { ...user };
      _user.username = '.login';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should be able to show an error when try to valid with not allowed username', (done) => {
      const _user = { ...user };
      _user.username = config.illegalUsernames[Math.floor(Math.random() * config.illegalUsernames.length)];

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should show error to valid username end with .', (done) => {
      const _user = { ...user };
      _user.username = 'login.';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should show error to valid username with ..', (done) => {
      const _user = { ...user };
      _user.username = 'log..in';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should show error to valid username shorter than 3 character', (done) => {
      const _user = { ...user };
      _user.username = 'lo';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should show error to valid a username without at least one alphanumeric character', (done) => {
      const _user = { ...user };
      _user.username = '-_-';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should show error to valid a username longer than 34 characters', (done) => {
      const _user = { ...user };
      _user.username = 'l'.repeat(35);

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.exist(result.error);
      done();
    });

    it('should to valid username with dot', (done) => {
      const _user = { ...user };
      _user.username = 'log.in';

      const result = Joi.validate(_user, schema.User);
      result.should.be.an('object');
      should.not.exist(result.error);
      done();
    });
  });
});
