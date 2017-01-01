'use strict';

import test from 'ava';
import request from 'request';

/**
 * Pre-condition for this test is to run on a clean database setup with no records existing
 */


// Before each test we setup a request object with defaults
// Making the request object available to tests through the shared object `t.context`
test.beforeEach('Setting up test defaults', t => {
  const requestObject = request.defaults({

    // Set the Base URL for all API requests
    baseUrl: 'http://localhost:3001',
    // Set data send/received to be JSON compatible
    json: true,
    // Set the cookie jar option to true which persists cookies
    // between API requests made, which enables us to perform
    // login and further API calls as a logged-in user.
    jar: true
  });

  t.context.request = requestObject;
});

test('API: Get All Tasks as anonymous user', async t => {
  let response = await new Promise(function (resolve, reject) {
    t.context.request.get({
      uri: '/api/tasks'
    }, function (error, response, body) {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 200, response.body.toString());
  t.true(response.body.length === 0, response.body.toString());
});

test('API: Get My Tasks as anonymous user', async t => {
  let response = await new Promise(function (resolve, reject) {
    t.context.request.get({
      uri: '/api/tasks/me'
    }, function (error, response, body) {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, response.body.toString());
  t.true(response.body.message === 'No session user', response.body.toString());
});

test('API: Create Task as anonymous user', async t => {
  let response = await new Promise(function (resolve, reject) {
    t.context.request.post({
      uri: '/api/tasks',
      body: {
        title: 'my test task'
      }
    }, function (error, response, body) {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, response.body.toString());
  t.true(response.body.message === 'No session user', response.body.toString());
});

test('API: Update Task as anonymous user', async t => {
  let response = await new Promise(function (resolve, reject) {
    t.context.request.put({
      uri: '/api/tasks',
      body: {
        title: 'my test task'
      }
    }, function (error, response, body) {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, response.body.toString());
  t.true(response.body.message === 'No session user', response.body.toString());
});

test('API: Delete Task as anonymous user', async t => {
  let response = await new Promise(function (resolve, reject) {
    t.context.request.delete({
      uri: '/api/tasks'
    }, function (error, response, body) {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });

  t.is(response.statusCode, 401, response.body.toString());
  t.true(response.body.message === 'No session user', response.body.toString());
});
