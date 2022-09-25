/**
 * Module dependencies
 */
import passport from 'passport';

import model from '../../../lib/middlewares/model.js';
import UsersSchema from '../../users/models/user.schema.js';
import auth from '../controllers/auth.controller.js';
import authPassword from '../controllers/auth.password.controller.js';

export default (app) => {
  // Setting up the users password api
  app.route('/api/auth/forgot').post(authPassword.forgot);
  app.route('/api/auth/reset/:token').get(authPassword.validateResetToken);
  app.route('/api/auth/reset').post(authPassword.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(model.isValid(UsersSchema.User), auth.signup);
  app.route('/api/auth/signin').post(passport.authenticate('local', { session: false }), auth.signin);

  // Jwt reset token
  app.route('/api/auth/token').get(passport.authenticate('jwt', { session: false }), auth.token);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(auth.oauthCall);
  app.route('/api/auth/:strategy/callback').get(auth.oauthCallback);
  app.route('/api/auth/:strategy/callback').post(auth.oauthCallback); // specific for apple call back
};
