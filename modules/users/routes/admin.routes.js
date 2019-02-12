/**
 * Module dependencies
 */
const passport = require('passport');
const adminPolicy = require('../policies/admin.policy');
const admin = require('../controllers/admin.controller');

module.exports = (app) => {
  /* eslint global-require: 0 */
  require('./users.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(passport.authenticate('jwt'), adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(admin.read)
    .put(passport.authenticate('jwt'), adminPolicy.isAllowed, admin.update)
    .delete(passport.authenticate('jwt'), adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
