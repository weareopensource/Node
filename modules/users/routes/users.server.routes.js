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

  // Setting up the users profile api
  app.route('/api/users/me').get(passport.authenticate('jwt'), users.me);
  app.route('/api/users').put(passport.authenticate('jwt'), model.isValid(schema.User), users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/accounts').post(model.isValid(schema.User), users.addOAuthProviderUserProfile);
  app.route('/api/users/password').post(passport.authenticate('jwt'), users.changePassword);
  app.route('/api/users/picture').post(passport.authenticate('jwt'), users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
