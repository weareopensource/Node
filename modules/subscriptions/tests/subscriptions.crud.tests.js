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
describe('Subscriptions CRUD Tests :', () => {
  let UserService = null;
  let app;
  let agent;
  let credentials;
  let user;
  let userEdited;
  let _user;
  let _userEdited;
  let _subscriptions;
  let subscription1;
  let subscription2;

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

  describe('Logout', () => {
    beforeEach(async () => {
      // subscriptions
      _subscriptions = [{
        email: 'test1@gmail.com',
        news: true,
      }, {
        email: 'test2@gmail.com',
        news: true,
      }];

      // add a subscription
      try {
        const result = await agent.post('/api/subscriptions')
          .send(_subscriptions[0])
          .expect(200);
        subscription1 = result.body.data;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to save a subscription', async () => {
      // add subscription
      try {
        const result = await agent.post('/api/subscriptions')
          .send(_subscriptions[1])
          .expect(200);
        subscription2 = result.body.data;
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('subscription created');
        expect(result.body.data.email).toBe(_subscriptions[1].email);
        expect(result.body.data.news).toBe(_subscriptions[1].news);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to save a subscription with bad model', async () => {
      // add subscription
      try {
        const result = await agent.post('/api/subscriptions')
          .send({
            email: 2,
            news: false,
          })
          .expect(422);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toEqual('Schema validation error');
        expect(result.body.description).toBe('"email" must be a string. ');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get a subscription', async () => {
      // delete subscription
      try {
        const result = await agent.get(`/api/subscriptions/${subscription2.id}`)
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('subscription get');
        expect(result.body.data.id).toBe(subscription2.id);
        expect(result.body.data.email).toBe(_subscriptions[1].email);
        expect(result.body.data.news).toBe(_subscriptions[1].news);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to get a subscription with a bad mongoose id', async () => {
      // delete subscription
      try {
        const result = await agent.get('/api/subscriptions/test')
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Subscription with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to get a subscription with a bad invented id', async () => {
      // delete subscription
      try {
        const result = await agent.get('/api/subscriptions/waos56397898004243871228')
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Subscription with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to update a subscription', async () => {
      // edit subscription
      try {
        const result = await agent.put(`/api/subscriptions/${subscription2.id}`)
          .send({ email: 'test3@gmail.com', news: true })
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('subscription updated');
        expect(result.body.data.id).toBe(subscription2.id);
        expect(result.body.data.email).toBe('test3@gmail.com');
        expect(result.body.data.news).toBe(_subscriptions[0].news);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to double an email in subscriptions', async () => {
      // edit subscription
      try {
        const result = await agent.put(`/api/subscriptions/${subscription2.id}`)
          .send(_subscriptions[0])
          .expect(422);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toEqual('Unprocessable Entity');
        expect(result.body.description).toBe('Validation failed.');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to update a subscription with a bad id', async () => {
      // edit subscription
      try {
        const result = await agent.put('/api/subscriptions/test')
          .send(_subscriptions[0])
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Subscription with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to delete a subscription', async () => {
      // delete subscription
      try {
        const result = await agent.delete(`/api/subscriptions/${subscription2.id}`)
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('subscription deleted');
        expect(result.body.data.id).toBe(subscription2.id);
        expect(result.body.data.deletedCount).toBe(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
      // check delete
      try {
        await agent.get(`/api/subscriptions/${subscription2.id}`)
          .expect(404);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to delete a subscription with a bad id', async () => {
      // edit subscription
      try {
        const result = await agent.delete(`/api/subscriptions/${subscription2.id}`)
          .send(_subscriptions[0])
          .expect(404);
        expect(result.body.type).toBe('error');
        expect(result.body.message).toBe('Not Found');
        expect(result.body.description).toBe('No Subscription with that identifier has been found');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to get list of subscriptions as guest', async () => {
      // get list
      try {
        const result = await agent.get('/api/subscriptions')
          .expect(401);
        expect(result.error.text).toBe('Unauthorized');
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    afterEach(async () => {
      // del subscription
      try {
        await agent.delete(`/api/subscriptions/${subscription1.id}`)
          .expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
    // user credentials
      credentials = [{
        email: 'test@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      }, {
        email: 'test2@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      }];

      // user
      _user = {
        firstName: 'Full',
        lastName: 'Name',
        email: credentials.email,
        password: credentials.password,
        provider: 'local',
      };
      _userEdited = _.clone(_user);
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

    test('should not be able to get list of subscriptions as a user', async () => {
      // get list
      try {
        await agent.get('/api/subscriptions')
          .expect(403);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should not be able to get list of subscriptions as an admin', async () => {
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
        const result = await agent.get('/api/subscriptions')
          .expect(200);
        expect(result.body.type).toBe('success');
        expect(result.body.message).toBe('subscription list');
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

    afterEach(async () => {
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
