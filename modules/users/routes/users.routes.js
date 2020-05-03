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
  const usersData = require('../controllers/users.data.controller');

  app.route('/api/users/me')
    .get(passport.authenticate('jwt'), users.me);

  app.route('/api/users').all(passport.authenticate('jwt'))
    .put(model.isValid(usersSchema.User), users.update)
    .delete(users.delete);

  app.route('/api/users/password')
    .post(passport.authenticate('jwt'), users.updatePassword);

  app.route('/api/users/avatar').all(passport.authenticate('jwt'))
    .post(multer.create('img', config.uploads.avatar), users.updateAvatar)
    .delete(users.deleteAvatar);

  app.route('/api/users/accounts')
    .delete(users.removeOAuthProvider)
    .post(model.isValid(usersSchema.User), users.addOAuthProviderUserProfile);

  app.route('/api/users/data').all(passport.authenticate('jwt'))
    .get(usersData.get)
    .delete(usersData.delete);

  app.route('/api/users/data/mail').all(passport.authenticate('jwt'))
    .get(usersData.getMail);
};
