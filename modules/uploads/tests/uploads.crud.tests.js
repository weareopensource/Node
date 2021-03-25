/**
 * Module dependencies.
 */
const request = require('supertest');
const path = require('path');

const express = require(path.resolve('./lib/services/express'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));
const multerService = require(path.resolve('./lib/services/multer'));

/**
 * Unit tests
 */
describe('Uploads CRUD Tests :', () => {
  let UserService = null;
  let app;
  let agent;
  let credentials;
  let user;
  let _user;
  let upload1;

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

  describe('Logged', () => {
    beforeEach(async () => {
      // user credentials
      credentials = {
        email: 'upload@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      };

      // user
      _user = {
        firstName: 'Full',
        lastName: 'Name',
        email: credentials.email,
        password: credentials.password,
        provider: 'local',
      };

      // add user
      try {
        const result = await agent.post('/api/auth/signup').send(_user).expect(200);
        user = result.body.user;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }

      // add a upload
      try {
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/default.png').expect(200);
        upload1 = result.body.data.avatar;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to read an upload', async () => {
      // add upload
      try {
        const result = await agent.get(`/api/uploads/${upload1}`).expect(200);
        expect(result.body).toBeInstanceOf(Buffer);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to read old upload if we update it', async () => {
      try {
        const result = await agent.post('/api/users/avatar').attach('img', './modules/users/tests/img/default.png').expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('profile avatar updated');
        expect(result.body.data).toBeInstanceOf(Object);
        expect(typeof result.body.data.avatar).toBe('string');
        expect(result.body.data.id).toBe(String(user.id));

        const _new = await agent.get(`/api/uploads/${result.body.data.avatar}`).expect(200);
        expect(_new.body).toBeDefined();

        const _old = await agent.get(`/api/uploads/${upload1}`).expect(404);
        expect(_old.body).toBeDefined();
        expect(_old.body.type).toBe('error');
        expect(_old.body.message).toBe('Not Found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to read an image upload', async () => {
      // add upload
      try {
        const result = await agent.get(`/api/uploads/images/${upload1}`).expect(200);
        expect(result.body).toBeInstanceOf(Buffer);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to read an image upload with size option', async () => {
      // add upload
      try {
        const input = upload1.split('.');
        const result = await agent.get(`/api/uploads/images/${input[0]}-512.${input[1]}`).expect(200);
        expect(result.body).toBeInstanceOf(Buffer);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to read an image upload with size option and effect', async () => {
      // add upload
      try {
        const input = upload1.split('.');
        const result = await agent.get(`/api/uploads/images/${input[0]}-512-blur.${input[1]}`).expect(200);
        expect(result.body).toBeInstanceOf(Buffer);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to read an image upload with wrong file name schema', async () => {
      // add upload
      try {
        const result = await agent.get('/api/uploads/images/test').expect(404);
        expect(result.body.message).toEqual('Not Found');
        expect(result.body.description).toEqual('Wrong name schema');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to read an image upload with too much params', async () => {
      // add upload
      try {
        const result = await agent.get('/api/uploads/images/filename-400-blur-test.png').expect(404);
        expect(result.body.message).toEqual('Not Found');
        expect(result.body.description).toEqual('Too much params');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to read an image upload with wrong name', async () => {
      // add upload
      try {
        const result = await agent.get('/api/uploads/images/filename-400-blur.png').expect(404);
        expect(result.body.message).toEqual('Not Found');
        expect(result.body.description).toEqual('No Upload with that name has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to read an image upload with wrong size option', async () => {
      // add upload
      try {
        const input = upload1.split('.');
        const result = await agent.get(`/api/uploads/images/${input[0]}-300.${input[1]}`).expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toEqual('Wrong size param');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to read an image upload with wrong size option', async () => {
      // add upload
      try {
        const input = upload1.split('.');
        const result = await agent.get(`/api/uploads/images/${input[0]}-512-toto.${input[1]}`).expect(422);
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toEqual('Operation param not available');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    afterEach(async () => {
      // del upload
      // try {
      //   await agent.delete(`/api/uploads/${upload1}`)
      //     .expect(200);
      // } catch (err) {
      //   console.log(err);
      //   expect(err).toBeFalsy();
      // }
      // del user
      try {
        await UserService.delete(user);
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
