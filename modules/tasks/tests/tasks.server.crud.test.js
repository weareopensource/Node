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
describe('User CRUD Unit Tests :', () => {
  let UserService = null;

  // Mongoose init
  beforeAll(() => mongooseService.connect()
    .then(() => {
      mongooseService.loadModels();
      UserService = require(path.resolve('./modules/users/services/user.service'));
    })
    .catch((e) => {
      console.log(e);
    }));


  // Globals
  let app;

  let agent;
  let credentials;
  let user;
  let _user;
  let _tasks;
  let task1;
  let task2;

  /**
 * User routes tests
 */
  describe('Task CRUD User logged', () => {
    beforeAll((done) => {
    // Get application
      app = express.init();
      agent = request.agent(app);

      done();
    });

    beforeEach(async () => {
    // user credentials
      credentials = {
        email: 'task@test.com',
        password: 'W@os.jsI$Aw3$0m3',
      };

      // user
      _user = {
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        username: 'task',
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

      // tasks
      _tasks = [{
        title: 'title1',
        description: 'do something about something else',
      }, {
        title: 'title2',
        description: 'do something about something else',
      }];

      // add a task
      try {
        const result = await agent.post('/api/tasks')
          .send(_tasks[0])
          .expect(200);
        task1 = result.body;
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to save a task if logged in', async () => {
      // add task
      try {
        const result = await agent.post('/api/tasks')
          .send(_tasks[1])
          .expect(200);
        task2 = result.body;

        expect(result.body.title).toBe(_tasks[1].title);
        expect(result.body.description).toBe(_tasks[1].description);
        expect(result.body.user).toBe(user.id);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get a task if logged in', async () => {
      // delete task
      try {
        const result = await agent.get(`/api/tasks/${task2.id}`)
          .expect(200);
        expect(result.body.id).toBe(task2.id);
        expect(result.body.title).toBe(_tasks[1].title);
        expect(result.body.description).toBe(_tasks[1].description);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to edit a task if logged in', async () => {
      // edit task
      try {
        const result = await agent.put(`/api/tasks/${task2.id}`)
          .send(_tasks[0])
          .expect(200);
        expect(result.body.id).toBe(task2.id);
        expect(result.body.title).toBe(_tasks[0].title);
        expect(result.body.description).toBe(_tasks[0].description);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to delete a task if logged in', async () => {
      // delete task
      try {
        const result = await agent.delete(`/api/tasks/${task2.id}`)
          .expect(200);
        expect(result.body.id).toBe(task2.id);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
      // check delete
      try {
        await agent.get(`/api/tasks/${task2.id}`)
          .expect(404);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    test('should be able to get list of tasks if logged in', async () => {
      // get list
      try {
        const result = await agent.get('/api/tasks')
          .expect(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(result.body).toHaveLength(1);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });

    afterEach(async () => {
      // del task
      try {
        await agent.delete(`/api/tasks/${task1.id}`)
          .expect(200);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
      // del user
      try {
        await UserService.remove(user);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('Task CRUD user logout', () => {
    beforeAll((done) => {
    // Get application
      app = express.init();
      agent = request.agent(app);

      done();
    });

    test('should not be able to save a task if not logged in', async () => {
      try {
        await agent.post('/api/tasks')
          .send(_tasks[0])
          .expect(401);
        // TODO error message
        // result.body.message.should.equal('User is not signed in');
      } catch (err) {
        expect(err).toBeFalsy();
        console.log(err);
      }
    });

    test('should be able to get list of tasks if logged out', async () => {
      // get list
      try {
        const result = await agent.get('/api/tasks')
          .expect(200);
        console.log(result.body);
        expect(result.body).toBeInstanceOf(Array);
        expect(result.body).toHaveLength(0);
      } catch (err) {
        console.log(err);
        expect(err).toBeFalsy();
      }
    });
  });

  // Mongoose disconnect
  afterAll(() => mongooseService.disconnect()
    .catch((e) => {
      console.log(e);
    }));
});
