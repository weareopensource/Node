import test from 'ava';
import request from 'request';

/**
 * Pre-condition for this test is to run on a clean database setup with no records existing
 */


// Before each test we setup a request object with defaults
// Making the request object available to tests through the shared object `t.context`
test.beforeEach('Setting up test defaults', (t) => {
  t.context.request = request.defaults({
    // Set the Base URL for all API requests
    baseUrl: 'http://localhost:3001',
    // Set data send/received to be JSON compatible
    json: true,
  });
});

test('API: Get All Tasks as anonymous user', async (t) => {
  const response = await new Promise((resolve, reject) => {
    t.context.request.get({
      uri: '/api/tasks',
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 200, JSON.stringify(response.body));
  t.true(response.body.length === 0, JSON.stringify(response.body));
});

test('API: Get My Tasks as anonymous user', async (t) => {
  const response = await new Promise((resolve, reject) => {
    t.context.request.get({
      uri: '/api/tasks/me',
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, JSON.stringify(response.body));
  t.true(response.body.message === 'No session user', JSON.stringify(response.body));
});

test('API: Create Task as anonymous user', async (t) => {
  const response = await new Promise((resolve, reject) => {
    t.context.request.post({
      uri: '/api/tasks',
      body: {
        title: 'my test task',
      },
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, JSON.stringify(response.body));
  t.true(response.body.message === 'No session user', JSON.stringify(response.body));
});

test('API: Update Task as anonymous user', async (t) => {
  const response = await new Promise((resolve, reject) => {
    t.context.request.put({
      uri: '/api/tasks',
      body: {
        title: 'my test task',
      },
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, JSON.stringify(response.body));
  t.true(response.body.message === 'No session user', JSON.stringify(response.body));
});

test('API: Delete Task as anonymous user', async (t) => {
  const response = await new Promise((resolve, reject) => {
    t.context.request.delete({
      uri: '/api/tasks',
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, JSON.stringify(response.body));
  t.true(response.body.message === 'No session user', JSON.stringify(response.body));
});
