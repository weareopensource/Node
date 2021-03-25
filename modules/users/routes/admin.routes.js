/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));
const admin = require('../controllers/admin.controller');

module.exports = (app) => {
  /* eslint global-require: 0 */
  require('./users.routes.js')(app);

  // stats
  app.route('/api/users/stats').all(policy.isAllowed).get(admin.stats);

  // Users
  app.route('/api/users').get(passport.authenticate('jwt'), policy.isAllowed, admin.list); // list

  // Users page
  app.route('/api/users/page/:userPage').get(passport.authenticate('jwt'), policy.isAllowed, admin.list); // list

  // Single user routes
  app
    .route('/api/users/:userId')
    .get(admin.get) // get
    .put(passport.authenticate('jwt'), policy.isAllowed, admin.update) // update
    .delete(passport.authenticate('jwt'), policy.isAllowed, admin.delete); // delete

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
  app.param('userPage', admin.userByPage);
};
