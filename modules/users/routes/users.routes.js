/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const multer = require(path.resolve('./lib/services/multer'));
const model = require(path.resolve('./lib/middlewares/model'));
const policy = require(path.resolve('./lib/middlewares/policy'));
const usersSchema = require('../models/user.schema');

const config = require(path.resolve('./config'));

module.exports = (app) => {
  const users = require('../controllers/users.controller');
  const usersData = require('../controllers/users.data.controller');
  const auth = require(path.resolve('./modules/auth/controllers/auth.controller'));

  app.route('/api/users/me').get(passport.authenticate('jwt'), policy.isAllowed, users.me);

  app.route('/api/users/terms').get(passport.authenticate('jwt'), policy.isAllowed, users.terms);

  app.route('/api/users').all(passport.authenticate('jwt'), policy.isAllowed).put(model.isValid(usersSchema.User), users.update).delete(users.delete);

  app.route('/api/users/password').post(passport.authenticate('jwt'), policy.isAllowed, auth.updatePassword);

  app
    .route('/api/users/avatar')
    .all(passport.authenticate('jwt'), policy.isAllowed)
    .post(multer.create('img', config.uploads.avatar), users.updateAvatar)
    .delete(users.deleteAvatar);

  app.route('/api/users/data').all(passport.authenticate('jwt'), policy.isAllowed).get(usersData.get).delete(usersData.delete);

  app.route('/api/users/data/mail').all(passport.authenticate('jwt'), policy.isAllowed).get(usersData.getMail);
};
