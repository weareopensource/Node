/**
 * Module dependencies.
 */
const _ = require('lodash');
// const chai = require('chai');
// const mongoose = require('mongoose');
const path = require('path');
const mock = require('mock-fs');

const config = require(path.resolve('./config'));
const logger = require(path.resolve('./lib/services/logger'));
// const seed = require(path.resolve('./lib/services/seed'));
// const mongooseService = require(path.resolve('./lib/services/mongoose.js'));


// const should = chai.should();

describe('Core Server Config:', () => {
  // let User = null;

  // Mongoose init
  // before(() => mongooseService.connect()
  //   .then(() => {
  //     mongooseService.loadModels();
  //     User = mongoose.model('User');
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   }));


  // Globals
  // let user1;
  // /let admin1;
  // let userFromSeedConfig;
  // let adminFromSeedConfig;
  let originalLogConfig;

  describe('Configuration Tests:', () => {
    // describe('Testing default seedDB', () => {
    //   before((done) => {
    //     User.remove((err) => {
    //       should.not.exist(err);

    //       // user1 = {
    //       //   username: 'user_config_test',
    //       //   provider: 'local',
    //       //   email: 'user_config_test_@localhost.com',
    //       //   firstName: 'User',
    //       //   lastName: 'Local',
    //       //   displayName: 'User Local',
    //       //   roles: ['user'],
    //       // };

    //       // admin1 = {
    //       //   username: 'admin_config_test',
    //       //   provider: 'local',
    //       //   email: 'admin_config_test_@localhost.com',
    //       //   firstName: 'Admin',
    //       //   lastName: 'Local',
    //       //   displayName: 'Admin Local',
    //       //   roles: ['user', 'admin'],
    //       // };

    //       userFromSeedConfig = config.seedDB.options.seedUser;
    //       adminFromSeedConfig = config.seedDB.options.seedAdmin;

    //       return done();
    //     });
    //   });

    //   after((done) => {
    //     User.remove((err) => {
    //       should.not.exist(err);
    //       return done();
    //     });
    //   });

    //   it('should have seedDB configuration set for "regular" user', () => {
    //     (typeof userFromSeedConfig).should.not.equal('undefined');
    //     should.exist(userFromSeedConfig.username);
    //     should.exist(userFromSeedConfig.email);
    //   });

    //   it('should have seedDB configuration set for admin user', () => {
    //     (typeof adminFromSeedConfig).should.not.equal('undefined');
    //     should.exist(adminFromSeedConfig.username);
    //     should.exist(adminFromSeedConfig.email);
    //   });

    //   it('should not be an admin user to begin with', (done) => {
    //     User.find({
    //       username: 'seedadmin',
    //     }, (err, users) => {
    //       should.not.exist(err);
    //       users.should.be.instanceof(Array).and.have.lengthOf(0);
    //       return done();
    //     });
    //   });

    //   it('should not be a "regular" user to begin with', (done) => {
    //     User.find({
    //       username: 'seeduser',
    //     }, (err, users) => {
    //       should.not.exist(err);
    //       users.should.be.instanceof(Array).and.have.lengthOf(0);
    //       return done();
    //     });
    //   });

    //   //   it('should seed ONLY the admin user account when NODE_ENV is set to "production"', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro production environment
    //   //     process.env.NODE_ENV = 'production';

    //   //     User.find({
    //   //       username: adminFromSeedConfig.username,
    //   //     }, (err, users) => {
    //   //     // There shouldn't be any errors
    //   //       should.not.exist(err);
    //   //       users.should.be.instanceof(Array).and.have.lengthOf(0);

    //   //       seed
    //   //         .start({
    //   //           logResults: false,
    //   //         })
    //   //         .then(() => {
    //   //           User.find({
    //   //             username: adminFromSeedConfig.username,
    //   //           }, (err, users) => {
    //   //             should.not.exist(err);
    //   //             users.should.be.instanceof(Array).and.have.lengthOf(1);

    //   //             const _admin = users.pop();
    //   //             _admin.username.should.equal(adminFromSeedConfig.username);

    //   //             // Restore original NODE_ENV environment variable
    //   //             process.env.NODE_ENV = nodeEnv;

    //   //             User.remove((err) => {
    //   //               should.not.exist(err);
    //   //               return done();
    //   //             });
    //   //           });
    //   //         });
    //   //     });
    //   //   });

    //   //   it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test"', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro production environment
    //   //     process.env.NODE_ENV = 'test';

    //   //     User.find({
    //   //       username: adminFromSeedConfig.username,
    //   //     }, (err, users) => {
    //   //     // There shouldn't be any errors
    //   //       should.not.exist(err);
    //   //       users.should.be.instanceof(Array).and.have.lengthOf(0);

    //   //       seed
    //   //         .start({
    //   //           logResults: false,
    //   //         })
    //   //         .then(() => {
    //   //           User.find({
    //   //             username: adminFromSeedConfig.username,
    //   //           }, (err, users) => {
    //   //             should.not.exist(err);
    //   //             users.should.be.instanceof(Array).and.have.lengthOf(1);

    //   //             const _admin = users.pop();
    //   //             _admin.username.should.equal(adminFromSeedConfig.username);

    //   //             User.find({
    //   //               username: userFromSeedConfig.username,
    //   //             }, (err, users) => {
    //   //               should.not.exist(err);
    //   //               users.should.be.instanceof(Array).and.have.lengthOf(1);

    //   //               const _user = users.pop();
    //   //               _user.username.should.equal(userFromSeedConfig.username);

    //   //               // Restore original NODE_ENV environment variable
    //   //               process.env.NODE_ENV = nodeEnv;

    //   //               User.remove((err) => {
    //   //                 should.not.exist(err);
    //   //                 return done();
    //   //               });
    //   //             });
    //   //           });
    //   //         });
    //   //     });
    //   //   });

    //   //   it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" when they already exist', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro production environment
    //   //     process.env.NODE_ENV = 'test';

    //   //     const _user = new User(userFromSeedConfig);
    //   //     const _admin = new User(adminFromSeedConfig);

    //   //     _admin.save((err) => {
    //   //     // There shouldn't be any errors
    //   //       should.not.exist(err);
    //   //       _user.save((err) => {
    //   //       // There shouldn't be any errors
    //   //         should.not.exist(err);

    //   //         User.find({
    //   //           username: {
    //   //             $in: [adminFromSeedConfig.username, userFromSeedConfig.username],
    //   //           },
    //   //         }, (err, users) => {
    //   //         // There shouldn't be any errors
    //   //           should.not.exist(err);
    //   //           users.should.be.instanceof(Array).and.have.lengthOf(2);

    //   //           seed
    //   //             .start({
    //   //               logResults: false,
    //   //             })
    //   //             .then(() => {
    //   //               User.find({
    //   //                 username: {
    //   //                   $in: [adminFromSeedConfig.username, userFromSeedConfig.username],
    //   //                 },
    //   //               }, (err, users) => {
    //   //                 should.not.exist(err);
    //   //                 users.should.be.instanceof(Array).and.have.lengthOf(2);

    //   //                 // Restore original NODE_ENV environment variable
    //   //                 process.env.NODE_ENV = nodeEnv;

    //   //                 User.remove((err) => {
    //   //                   should.not.exist(err);
    //   //                   return done();
    //   //                 });
    //   //               });
    //   //             });
    //   //         });
    //   //       });
    //   //     });
    //   //   });

    //   //   it('should ONLY seed admin user account when NODE_ENV is set to "production" with custom admin', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro production environment
    //   //     process.env.NODE_ENV = 'production';

    //   //     User.find({
    //   //       username: admin1.username,
    //   //     }, (err, users) => {
    //   //     // There shouldn't be any errors
    //   //       should.not.exist(err);
    //   //       users.should.be.instanceof(Array).and.have.lengthOf(0);

    //   //       seed
    //   //         .start({
    //   //           logResults: false,
    //   //           seedAdmin: admin1,
    //   //         })
    //   //         .then(() => {
    //   //           User.find({
    //   //             username: admin1.username,
    //   //           }, (err, users) => {
    //   //             should.not.exist(err);
    //   //             users.should.be.instanceof(Array).and.have.lengthOf(1);

    //   //             const _admin = users.pop();
    //   //             _admin.username.should.equal(admin1.username);

    //   //             // Restore original NODE_ENV environment variable
    //   //             process.env.NODE_ENV = nodeEnv;

    //   //             User.remove((err) => {
    //   //               should.not.exist(err);
    //   //               return done();
    //   //             });
    //   //           });
    //   //         });
    //   //     });
    //   //   });

    //   //   it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" with custom options', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro production environment
    //   //     process.env.NODE_ENV = 'test';

    //   //     User.find({
    //   //       username: admin1.username,
    //   //     }, (err, users) => {
    //   //     // There shouldn't be any errors
    //   //       should.not.exist(err);
    //   //       users.should.be.instanceof(Array).and.have.lengthOf(0);

    //   //       seed
    //   //         .start({
    //   //           logResults: false,
    //   //           seedAdmin: admin1,
    //   //           seedUser: user1,
    //   //         })
    //   //         .then(() => {
    //   //           User.find({
    //   //             username: admin1.username,
    //   //           }, (err, users) => {
    //   //             should.not.exist(err);
    //   //             users.should.be.instanceof(Array).and.have.lengthOf(1);

    //   //             const _admin = users.pop();
    //   //             _admin.username.should.equal(admin1.username);

    //   //             User.find({
    //   //               username: user1.username,
    //   //             }, (err, users) => {
    //   //               should.not.exist(err);
    //   //               users.should.be.instanceof(Array).and.have.lengthOf(1);

    //   //               const _user = users.pop();
    //   //               _user.username.should.equal(user1.username);

    //   //               // Restore original NODE_ENV environment variable
    //   //               process.env.NODE_ENV = nodeEnv;

    //   //               User.remove((err) => {
    //   //                 should.not.exist(err);
    //   //                 return done();
    //   //               });
    //   //             });
    //   //           });
    //   //         });
    //   //     });
    //   //   });

    //   //   it('should NOT seed admin user account if it already exists when NODE_ENV is set to "production"', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro production environment
    //   //     process.env.NODE_ENV = 'production';

    //   //     const _admin = new User(adminFromSeedConfig);

    //   //     _admin.save((err, user) => {
    //   //     // There shouldn't be any errors
    //   //       should.not.exist(err);
    //   //       user.username.should.equal(adminFromSeedConfig.username);

    //   //       seed
    //   //         .start({
    //   //           logResults: false,
    //   //         })
    //   //         .then(() => {
    //   //         // we don't ever expect to make it here but we don't want to timeout
    //   //           User.remove((err) => {
    //   //             should.not.exist(err);
    //   //             // force this test to fail since we should never be here
    //   //             should.exist(undefined);
    //   //             // Restore original NODE_ENV environment variable
    //   //             process.env.NODE_ENV = nodeEnv;

    //   //             return done();
    //   //           });
    //   //         })
    //   //         .catch((err) => {
    //   //           should.exist(err);
    //   //           err.message.should.equal(`Failed due to local account already exists: ${adminFromSeedConfig.username}`);

    //   //           // Restore original NODE_ENV environment variable
    //   //           process.env.NODE_ENV = nodeEnv;

    //   //           User.remove((removeErr) => {
    //   //             should.not.exist(removeErr);

    //   //             return done();
    //   //           });
    //   //         });
    //   //     });
    //   //   });

    //   //   it('should NOT seed "regular" user account if missing email when NODE_ENV set to "test"', (done) => {
    //   //   // Save original value
    //   //     const nodeEnv = process.env.NODE_ENV;
    //   //     // Set node env ro test environment
    //   //     process.env.NODE_ENV = 'test';

    //   //     const _user = new User(user1);
    //   //     _user.email = '';

    //   //     seed
    //   //       .start({
    //   //         logResults: false,
    //   //         seedUser: _user,
    //   //       })
    //   //       .then(() => {
    //   //       // we don't ever expect to make it here but we don't want to timeout
    //   //         User.remove(() => {
    //   //         // force this test to fail since we should never be here
    //   //           should.exist(undefined);
    //   //           // Restore original NODE_ENV environment variable
    //   //           process.env.NODE_ENV = nodeEnv;

    //   //           return done();
    //   //         });
    //   //       })
    //   //       .catch((err) => {
    //   //         should.exist(err);
    //   //         err.message.should.equal(`Failed to add local ${user1.username}`);

    //   //         // Restore original NODE_ENV environment variable
    //   //         process.env.NODE_ENV = nodeEnv;

    //   //         User.remove((removeErr) => {
    //   //           should.not.exist(removeErr);

    //   //           return done();
    //   //         });
    //   //       });
    //   //   });
    // });

    describe('Testing Logger Configuration', () => {
      beforeEach(() => {
        originalLogConfig = _.clone(config.log, true);
        mock();
      });

      afterEach(() => {
        config.log = originalLogConfig;
        mock.restore();
      });

      test(
        'should verify that a file logger object was created using the logger configuration',
        () => {
          const _dir = process.cwd();
          const _filename = 'unit-test-access.log';

          config.log = {
            fileLogger: {
              directoryPath: _dir,
              fileName: _filename,
            },
          };

          const fileTransport = logger.setupFileLogger(config);
          expect(fileTransport).toBeInstanceOf(Object);
          expect(fileTransport.filename).toBe(`${_dir}/${_filename}`);
        },
      );

      test(
        'should not create a file transport object if critical options are missing: filename',
        () => {
          // manually set the config stream fileName option to an empty string
          config.log = {
            format: 'combined',
            options: {
              stream: {
                directoryPath: process.cwd(),
                fileName: '',
              },
            },
          };

          const fileTransport = logger.setupFileLogger(config);
          expect(fileTransport).toBe(false);
        },
      );

      test(
        'should not create a file transport object if critical options are missing: directory',
        () => {
          // manually set the config stream fileName option to an empty string
          config.log = {
            format: 'combined',
            options: {
              stream: {
                directoryPath: '',
                fileName: 'app.log',
              },
            },
          };

          const fileTransport = logger.setupFileLogger(config);
          expect(fileTransport).toBe(false);
        },
      );
    });
  });

  // Mongoose disconnect
  // after(() => mongooseService.disconnect()
  //   .catch((e) => {
  //     console.log(e);
  //   }));
});
