/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const usersSchema = require('../models/user.schema');

module.exports = (app) => {
  const users = require('../controllers/users.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(model.isValid(usersSchema.User), users.signup);
  app.route('/api/auth/signin').post(passport.authenticate('local'), users.signin);

  // Jwt reset token
  app.route('/api/auth/token').get(passport.authenticate('jwt'), users.token);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall);
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback);
};
