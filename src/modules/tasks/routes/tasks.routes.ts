/**
 * Module dependencies
 */
import passport from 'passport';

import * as tasks from '../controllers/tasks.controller';
import * as model from '../../../lib/middlewares/model';
import * as policy from '../../../lib/middlewares/policy';
import tasksSchema from '../models/tasks.schema';

/**
 * Routes
 */
export default (app) => {
  // stats
  app.route('/api/tasks/stats').all(policy.isAllowed)
    .get(tasks.stats);

  // list & post
  app.route('/api/tasks')
    .get(tasks.list) // list
    .post(passport.authenticate('jwt'), policy.isAllowed, model.isValid(tasksSchema), tasks.create); // create

  // classic crud
  app.route('/api/tasks/:taskId').all(passport.authenticate('jwt'), policy.isAllowed) // policy.isOwner available (require set in middleWare)
    .get(tasks.get) // get
    .put(model.isValid(tasksSchema), tasks.update) // update
    .delete(model.isValid(tasksSchema), tasks.deleteTask); // delete

  // Finish by binding the task middleware
  app.param('taskId', tasks.taskByID);
};
