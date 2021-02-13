/**
 * Module dependencies
 */
import passport from 'passport';

import config from '../../../config';
import * as multer from '../../../lib/services/multer';
import * as model from '../../../lib/middlewares/model';
import * as policy from '../../../lib/middlewares/policy';
import { updatePassword } from '../../auth/controllers/auth/auth.password.controller';
import { getMail, get, deleteUser } from '../controllers/users.data.controller';
import usersSchema from '../models/user.schema';
import users from '../controllers/users.controller';

export default (app) => {
  app.route('/api/users/me')
    .get(passport.authenticate('jwt'), policy.isAllowed, users.me);

  app.route('/api/users/terms')
    .get(passport.authenticate('jwt'), policy.isAllowed, users.terms);

  app.route('/api/users').all(passport.authenticate('jwt'), policy.isAllowed)
    .put(model.isValid(usersSchema.User), users.update)
    .delete(users.deleteUser);

  app.route('/api/users/password')
    .post(passport.authenticate('jwt'), policy.isAllowed, updatePassword);

  app.route('/api/users/avatar').all(passport.authenticate('jwt'), policy.isAllowed)
    .post(multer.create('img', config.uploads.avatar), users.updateAvatar)
    .delete(users.deleteAvatar);

  app.route('/api/users/data').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(get)
    .delete(deleteUser);

  app.route('/api/users/data/mail').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(getMail);
};
