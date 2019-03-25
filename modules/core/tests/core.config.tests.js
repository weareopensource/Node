/**
 * Module dependencies.
 */
const _ = require('lodash');
const path = require('path');
// const mock = require('mock-fs');

const config = require(path.resolve('./config'));
const logger = require(path.resolve('./lib/services/logger'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));
const seed = require(path.resolve('./lib/services/seed'));

/**
 * Unit tests
 */
describe('Configuration Tests:', () => {
  let UserService = null;

  beforeAll(() => mongooseService.connect()
    .then(() => {
      mongooseService.loadModels();
      UserService = require(path.resolve('./modules/users/services/user.service'));
    })
    .catch((e) => {
      console.log(e);
    }));

  let user1;
  let admin1;
  let userFromSeedConfig;
  let adminFromSeedConfig;

  let originalLogConfig;

  describe('Testing default seedDB', () => {
    beforeAll((done) => {
      user1 = {
        username: 'user_config_test',
        provider: 'local',
        email: 'user_config_test_@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user'],
      };

      admin1 = {
        username: 'admin_config_test',
        provider: 'local',
        email: 'admin_config_test_@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin'],
      };

      userFromSeedConfig = config.seedDB.options.seedUser;
      adminFromSeedConfig = config.seedDB.options.seedAdmin;
      done();
    });

    it('should have seedDB configuration set for "regular" user', (done) => {
      expect(userFromSeedConfig).toBeInstanceOf(Object);
      expect(typeof userFromSeedConfig.username).toBe('string');
      expect(typeof userFromSeedConfig.email).toBe('string');
      done();
    });

    it('should have seedDB configuration set for admin user', (done) => {
      expect(userFromSeedConfig).toBeInstanceOf(Object);
      expect(typeof adminFromSeedConfig.username).toBe('string');
      expect(typeof adminFromSeedConfig.email).toBe('string');
      done();
    });

    it('should seed ONLY the admin user account when NODE_ENV is set to "production"', async () => {
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      let seedusers;

      try {
        seedusers = await seed.start({ logResults: false }, UserService);
        expect(seedusers).toBeInstanceOf(Array);
        expect(seedusers).toHaveLength(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete({ id: seedusers[0]._id });
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      process.env.NODE_ENV = nodeEnv;
    });

    it('should seed admin, and regular user accounts when NODE_ENV is set to "test"', async () => {
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      let seedusers;

      try {
        seedusers = await seed.start({ logResults: false }, UserService);
        expect(seedusers).toBeInstanceOf(Array);
        expect(seedusers).toHaveLength(2);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete({ id: seedusers[0]._id });
        await UserService.delete({ id: seedusers[1]._id });
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      process.env.NODE_ENV = nodeEnv;
    });


    it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" when they already exist', async () => {
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      let _user;
      let _admin;
      let seedusers;

      try {
        _user = await UserService.create(userFromSeedConfig);
        _admin = await UserService.create(adminFromSeedConfig);
        expect(_user).toBeInstanceOf(Object);
        expect(_admin).toBeInstanceOf(Object);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        const result = await UserService.search({ username: { $in: [adminFromSeedConfig.username, userFromSeedConfig.username] } });
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        seedusers = await seed.start({ logResults: false }, UserService);
        expect(seedusers).toBeInstanceOf(Array);
        expect(seedusers).toHaveLength(2);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete({ id: seedusers[0]._id });
        await UserService.delete({ id: seedusers[1]._id });
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      process.env.NODE_ENV = nodeEnv;
    });

    it('should ONLY seed admin user account when NODE_ENV is set to "production" with custom admin', async () => {
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      let seedusers;

      try {
        seedusers = await seed.start({ logResults: false, seedAdmin: admin1 }, UserService);
        expect(seedusers).toBeInstanceOf(Array);
        expect(seedusers).toHaveLength(1);
        expect(seedusers[0].username).toBe(admin1.username);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete({ id: seedusers[0]._id });
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      process.env.NODE_ENV = nodeEnv;
    });

    it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" with custom options', async () => {
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      let seedusers;

      try {
        seedusers = await seed.start({ logResults: false, seedAdmin: admin1, seedUser: user1 }, UserService);
        expect(seedusers).toBeInstanceOf(Array);
        expect(seedusers).toHaveLength(2);
        expect(seedusers[0].username).toBe(user1.username);
        expect(seedusers[1].username).toBe(admin1.username);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        await UserService.delete({ id: seedusers[0]._id });
        await UserService.delete({ id: seedusers[1]._id });
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      process.env.NODE_ENV = nodeEnv;
    });

    it('should NOT seed admin user account if it already exists when NODE_ENV is set to "production"', async () => {
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      let _admin;
      let seedusers;

      try {
        _admin = await UserService.create(adminFromSeedConfig);
        expect(_admin).toBeInstanceOf(Object);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      try {
        seedusers = await seed.start({ logResults: false }, UserService);
        expect(seedusers[0].details[0].message).toBe('Failed due to local account already exists: seedadmin');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      process.env.NODE_ENV = nodeEnv;
    });
  });

  describe('Testing Logger Configuration', () => {
    beforeEach(() => {
      originalLogConfig = _.clone(config.log, true);
      // mock();
    });

    afterEach(() => {
      config.log = originalLogConfig;
      // mock.restore();
    });

    test('should verify that a file logger object was created using the logger configuration', () => {
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
    });

    test('should not create a file transport object if critical options are missing: filename', () => {
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
    });

    test('should not create a file transport object if critical options are missing: directory', () => {
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
    });
  });

  // Mongoose disconnect
  afterAll(() => mongooseService.disconnect()
    .catch((e) => {
      console.log(e);
    }));
});
