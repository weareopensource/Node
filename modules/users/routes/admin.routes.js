/**
 * Module dependencies
 */
import passport from "passport";

import policy from "../../../lib/middlewares/policy.js"
import admin from "../controllers/admin.controller.js"

export default (app) => {
  // stats
  app.route('/api/users/stats').all(policy.isAllowed).get(admin.stats);

  // Users
  app.route('/api/users').get(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.list); // list

  // Users page
  app.route('/api/users/page/:userPage').get(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.list); // list

  // Single user routes
  app
    .route('/api/users/:userId')
    .get(admin.get) // get
    .put(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.update) // update
    .delete(passport.authenticate('jwt', { session: false }), policy.isAllowed, admin.remove); // delete

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
  app.param('userPage', admin.userByPage);
};
