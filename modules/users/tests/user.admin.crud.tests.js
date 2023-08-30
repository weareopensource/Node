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
describe('User admin CRUD Tests :', () => {
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
  describe('Logged', () => {
    beforeEach(async () => {
      // users credentials
      credentials = [
        {
          email: 'admin@test.com',
          password: 'W@os.jsI$Aw3$0m3',
        },
        {
          email: 'admin2@test.com',
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

    test('should not be able to retrieve a list of users if not admin', async () => {
      try {
        const result = await agent.get('/api/users').expect(403);
        expect(result.body.message).toBe('Unauthorized');
        expect(result.body.description).toBe('User is not authorized');
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
        await UserService.remove(userEdited);
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
        await UserService.remove(userEdited);
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
        await UserService.remove(userEdited);
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
        await UserService.remove(userEdited);
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
        await UserService.remove(userEdited);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to remove a single user if admin', async () => {
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
        await UserService.remove(userEdited);
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
