/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const schema = require('../models/user.server.schema');

module.exports = (app) => {
  // User Routes
  const users = require('../controllers/users.server.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(model.isValid(schema.User), users.signup);
  app.route('/api/auth/signin').post(passport.authenticate('local'), users.signin);

  // Jwt token
  app.route('/api/auth/token').post(model.isValid(schema.User), users.token);
  // Jwt protected route example:
  // app.route('/api/auth/secretPlace').get(passport.authenticate('jwt'), (req, res) => {
  //   console.log(req.user)
  //   console.log(req.isAuthenticated())
  //   res.status(200).send()
  // })

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall);
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback);
};
