/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const tasks = require('../controllers/tasks.server.controller');
const tasksSchema = require('../models/tasks.server.schema');
const tasksPolicy = require('../policies/tasks.server.policy');


module.exports = (app) => {
  // list & post
  app.route('/api/tasks')
    .get(tasks.list)
    .post(passport.authenticate('jwt'), tasksPolicy.isAllowed, model.isValid(tasksSchema.Task), tasks.create);

  // classic crud
  app.route('/api/tasks/:taskId').all(passport.authenticate('jwt'), tasksPolicy.isAllowed)
    .get(tasks.read)
    .put(model.isValid(tasksSchema.Task), tasks.update)
    .delete(model.isValid(tasksSchema.Task), tasks.delete);

  // Finish by binding the task middleware
  app.param('taskId', tasks.taskByID);
};
