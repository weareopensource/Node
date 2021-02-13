/**
 * Module dependencies
 */
import { Application } from 'express';
import passport from 'passport';
import auth from '../controllers/auth.controller';
import * as model from '../../../lib/middlewares/model';
import usersSchema from '../../users/models/user.schema';

export default (app: Application) => {
  // Setting up the users password api
  app.route('/api/auth/forgot').post(auth.forgot);
  app.route('/api/auth/reset/:token').get(auth.validateResetToken);
  app.route('/api/auth/reset').post(auth.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(model.isValid(usersSchema), auth.signup);
  app.route('/api/auth/signin').post(passport.authenticate('local'), auth.signin);

  // Jwt reset token
  app.route('/api/auth/token').get(passport.authenticate('jwt'), auth.buildToken);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(auth.oauthCall);
  app.route('/api/auth/:strategy/callback').get(auth.oauthCallback);
  app.route('/api/auth/:strategy/callback').post(auth.oauthCallback); // specific for apple call back
};
