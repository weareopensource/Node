/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const multer = require(path.resolve('./lib/services/multer'));
const model = require(path.resolve('./lib/middlewares/model'));
const usersSchema = require('../models/user.schema');


const config = require(path.resolve('./config'));

module.exports = (app) => {
  const users = require('../controllers/users.controller');
  const usersData = require('../controllers/users/users.data.controller');

  app.route('/api/users/me').get(passport.authenticate('jwt'), users.me);

  app.route('/api/users')
    .put(passport.authenticate('jwt'), model.isValid(usersSchema.User), users.update)
    .delete(passport.authenticate('jwt'), users.delete);

  app.route('/api/users/data')
    .get(passport.authenticate('jwt'), usersData.getMail)
    .delete(passport.authenticate('jwt'), usersData.delete);

  app.route('/api/users/accounts')
    .delete(users.removeOAuthProvider)
    .post(model.isValid(usersSchema.User), users.addOAuthProviderUserProfile);

  app.route('/api/users/password').post(passport.authenticate('jwt'), users.updatePassword);

  app.route('/api/users/picture').post(passport.authenticate('jwt'), multer.create('img', config.uploads.avatar), users.updateProfilePicture);
};
