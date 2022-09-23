/**
 * Module dependencies
 */
import passport from "passport";

import multer from "../../../lib/services/multer.js";
import model from "../../../lib/middlewares/model.js";
import config from "../../../config/index.js";
import policy from "../../../lib/middlewares/policy.js";
import usersSchema from "../models/user.schema.js";
import users from "../controllers/users.account.controller.js"
import usersImage from "../controllers/users.images.controller.js"
import usersData from "../controllers/users.data.controller.js"
import authPassword from "../../auth/controllers/auth.password.controller.js"

export default (app) => {
  
  app.route('/api/users/me').get(passport.authenticate('jwt', { session: false }), policy.isAllowed, users.me);

  app.route('/api/users/terms').get(passport.authenticate('jwt', { session: false }), policy.isAllowed, users.terms);

  app
    .route('/api/users')
    .all(passport.authenticate('jwt', { session: false }), policy.isAllowed)
    .put(model.isValid(usersSchema.User), users.update)
    .delete(users.remove);

  app.route('/api/users/password')
    .post(passport.authenticate('jwt', { session: false }), policy.isAllowed, authPassword.updatePassword);

  app
    .route('/api/users/avatar')
    .all(passport.authenticate('jwt', { session: false }), policy.isAllowed)
    .post(multer.create('img', config.uploads.avatar), usersImage.updateAvatar)
    .delete(usersImage.removeAvatar);

  app
    .route('/api/users/data')
    .all(passport.authenticate('jwt', { session: false }), policy.isAllowed)
    .get(usersData.get)
    .delete(usersData.remove);

  app
    .route('/api/users/data/mail')
    .all(passport.authenticate('jwt', { session: false }), policy.isAllowed)
    .get(usersData.getMail);
};
