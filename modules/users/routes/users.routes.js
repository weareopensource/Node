/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const usersSchema = require('../models/user.schema');


module.exports = (app) => {
  const users = require('../controllers/users.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(passport.authenticate('jwt'), users.me);
  app.route('/api/users').put(passport.authenticate('jwt'), model.isValid(usersSchema.User), users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/accounts').post(model.isValid(usersSchema.User), users.addOAuthProviderUserProfile);
  app.route('/api/users/password').post(passport.authenticate('jwt'), users.changePassword);
  app.route('/api/users/picture').post(passport.authenticate('jwt'), users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
