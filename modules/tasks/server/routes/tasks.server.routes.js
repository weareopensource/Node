/**
 * Module dependencies
 */
const tasksPolicy = require('../policies/tasks.server.policy');
const tasks = require('../controllers/mongoose/tasks.server.controller');
const passport = require('passport');

module.exports = app => {

  // Tasks collection routes
  app.route('/api/tasks').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.list)
    .post(tasks.create);

  app.route('/api/tasks/me').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.userList);

  // Single task routes
  app.route('/api/tasks/:taskId').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.read)
    .put(tasks.update)
    .delete(tasks.delete);

  // Finish by binding the task middleware
  app.param('taskId', tasks.taskByID);
};
