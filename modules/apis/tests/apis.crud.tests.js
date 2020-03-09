/**
 * Module dependencies.
 */
const request = require('supertest');
const path = require('path');

const express = require(path.resolve('./lib/services/express'));
const mongooseService = require(path.resolve('./lib/services/mongoose'));

/**
 * Unit tests
 */
describe('Apis CRUD Tests :', () => {
  let UserService = null;
  let app;
  let agent;
  let credentials;
  let user;
  let _user;
  let _apis;
  let api1;
  let api2;

  //  init
  beforeAll(async () => {
    try {
      // init mongo
      await mongooseService.connect();
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
        email: 'api@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      };

      // user
      _user = {
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: credentials.email,
        password: credentials.password,
        provider: 'local',
      };

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

      // apis
      _apis = [{
        title: 'title1',
        description: 'do something about something else',
      }, {
        title: 'title2',
        description: 'do something about something else',
      }];

      // add a api
      try {
        const result = await agent.post('/api/apis')
          .send(_apis[0])
          .expect(200);
        api1 = result.body.data;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to save a api', async () => {
      // add api
      try {
        const result = await agent.post('/api/apis')
          .send(_apis[1])
          .expect(200);
        api2 = result.body.data;
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('api created');
        expect(result.body.data.title).toBe(_apis[1].title);
        expect(result.body.data.description).toBe(_apis[1].description);
        expect(result.body.data.user).toBe(user.id);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to save a api with bad model', async () => {
      // add api
      try {
        const result = await agent.post('/api/apis')
          .send({
            title: 2,
            description: 'do something about something else',
          })
          .expect(422);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toEqual('Schema validation error');
        expect(result.body.description).toBe('Title must be a string. ');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get a api', async () => {
      // delete api
      try {
        const result = await agent.get(`/api/apis/${api2.id}`)
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('api get');
        expect(result.body.data.id).toBe(api2.id);
        expect(result.body.data.title).toBe(_apis[1].title);
        expect(result.body.data.description).toBe(_apis[1].description);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to get a api with a bad mongoose id', async () => {
      // delete api
      try {
        const result = await agent.get('/api/apis/test')
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Api with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to get a api with a bad invented id', async () => {
      // delete api
      try {
        const result = await agent.get('/api/apis/waos56397898004243871228')
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Api with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to update a api if', async () => {
      // edit api
      try {
        const result = await agent.put(`/api/apis/${api2.id}`)
          .send(_apis[0])
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('api updated');
        expect(result.body.data.id).toBe(api2.id);
        expect(result.body.data.title).toBe(_apis[0].title);
        expect(result.body.data.description).toBe(_apis[0].description);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update a api with a bad id', async () => {
      // edit api
      try {
        const result = await agent.put('/api/apis/test')
          .send(_apis[0])
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Api with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to delete a api', async () => {
      // delete api
      try {
        const result = await agent.delete(`/api/apis/${api2.id}`)
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('api deleted');
        expect(result.body.data.id).toBe(api2.id);
        expect(result.body.data.deletedCount).toBe(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
      // check delete
      try {
        await agent.get(`/api/apis/${api2.id}`)
          .expect(404);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to delete a api with a bad id', async () => {
      // edit api
      try {
        const result = await agent.delete(`/api/apis/${api2.id}`)
          .send(_apis[0])
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Api with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });


    test('should be able to get list of apis', async () => {
      // get list
      try {
        const result = await agent.get('/api/apis')
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('api list');
        expect(result.body.data).toBeInstanceOf(Array);
        expect(result.body.data).toHaveLength(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    afterEach(async () => {
      // del api
      try {
        await agent.delete(`/api/apis/${api1.id}`)
          .expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
      // del user
      try {
        await UserService.delete(user);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('Logout', () => {
    test('should not be able to save a api', async () => {
      try {
        const result = await agent.post('/api/apis')
          .send(_apis[0])
          .expect(401);
        expect(result.error.text).toBe('Unauthorized');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should be able to get list of apis', async () => {
      // get list
      try {
        const result = await agent.get('/api/apis')
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('api list');
        expect(result.body.data).toBeInstanceOf(Array);
        expect(result.body.data).toHaveLength(0);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
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
