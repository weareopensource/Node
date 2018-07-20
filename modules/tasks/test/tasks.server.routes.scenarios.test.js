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
    // Set the cookie jar option to true which persists cookies
    // between API requests made, which enables us to perform
    // login and further API calls as a logged-in user.
    jar: true,
  });
});

test.serial('API: Create a task as a newly registered user', async (t) => {
  // Create a new user object
  const user = {
    firstName: 'Full',
    lastName: 'Name',
    email: 'test1@test.com',
    username: 'tasks2',
    password: 'M3@n.jsI$Aw3$0m3',
  };

  // Create a new task object
  const task = {
    title: 'task title',
  };

  const signupResponse = await new Promise((resolve, reject) => {
    t.context.request.post({
      uri: '/api/auth/signup',
      body: user,
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });
  t.is(signupResponse.statusCode, 200, JSON.stringify(signupResponse.body));

  const signinResponse = await new Promise((resolve, reject) => {
    t.context.request.post({
      uri: '/api/auth/signin',
      body: {
        usernameOrEmail: user.email,
        password: user.password,
      },
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });
  t.is(signinResponse.statusCode, 200, JSON.stringify(signinResponse.body));

  const tasksCreatedResponse = await new Promise((resolve, reject) => {
    t.context.request.post({
      uri: '/api/tasks',
      body: {
        title: task.title,
      },
    }, (error, response) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });
  t.is(tasksCreatedResponse.statusCode, 200, JSON.stringify(tasksCreatedResponse.body));
});
