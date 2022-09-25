/**
 * Module dependencies
 */
import passport from 'passport';

import policy from '../../../lib/middlewares/policy.js';
import admin from '../controllers/users.admin.controller.js';

export default (app) => {
  // Users
  app.route('/api/users').get(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.list); // list

  // Users page
  app.route('/api/users/page/:userPage').get(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.list); // list

  // Single user routes
  app
    .route('/api/users/:userId')
    .get(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.get) // get
    .put(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.update) // update
    .delete(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.remove); // delete

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
  app.param('userPage', admin.userByPage);
};
