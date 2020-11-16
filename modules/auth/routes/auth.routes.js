/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const usersSchema = require(path.resolve('./modules/users/models/user.schema'));

module.exports = (app) => {
  const auth = require(path.resolve('./modules/auth/controllers/auth.controller'));

  // Setting up the users password api
  app.route('/api/auth/forgot').post(auth.forgot);
  app.route('/api/auth/reset/:token').get(auth.validateResetToken);
  app.route('/api/auth/reset').post(auth.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(model.isValid(usersSchema.User), auth.signup);
  app.route('/api/auth/signin').post(passport.authenticate('local'), auth.signin);

  // Jwt reset token
  app.route('/api/auth/token').get(passport.authenticate('jwt'), auth.token);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(auth.oauthCall);
  app.route('/api/auth/:strategy/callback').get(auth.oauthCallback);
  app.route('/api/auth/:strategy/callback').post(auth.oauthCallback); // specific for apple call back
};
