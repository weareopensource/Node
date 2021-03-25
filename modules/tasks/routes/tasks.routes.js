/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const policy = require(path.resolve('./lib/middlewares/policy'));
const tasks = require('../controllers/tasks.controller');
const tasksSchema = require('../models/tasks.schema');

/**
 * Routes
 */
module.exports = (app) => {
  // stats
  app.route('/api/tasks/stats').all(policy.isAllowed).get(tasks.stats);

  // list & post
  app
    .route('/api/tasks')
    .get(tasks.list) // list
    .post(passport.authenticate('jwt'), policy.isAllowed, model.isValid(tasksSchema.Task), tasks.create); // create

  // classic crud
  app
    .route('/api/tasks/:taskId')
    .all(passport.authenticate('jwt'), policy.isAllowed) // policy.isOwner available (require set in middleWare)
    .get(tasks.get) // get
    .put(model.isValid(tasksSchema.Task), tasks.update) // update
    .delete(model.isValid(tasksSchema.Task), tasks.delete); // delete

  // Finish by binding the task middleware
  app.param('taskId', tasks.taskByID);
};
