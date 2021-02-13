/**
 * Module dependencies
 */
import path from 'path';
import passport from 'passport';
import * as UserService from '../../users/services/user.service';
import config from '../../../config';

declare global {
  namespace Express {
    interface User {
      id?: number;
    }
  }
}

/**
 * Module init function
 */
export default (app) => {
  // Serialize identifiable user's information to the session
  // so that it can be pulled back in another request
  passport.serializeUser(({ id }, done) => {
    done(null, id);
  });

  // Deserialize get the user identifying information that we saved
  // in `passport.serializeUser()` and resolves the user account
  // from it so it can be saved in `req.user`
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserService.get({ id });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach((strategy) => {
    require(path.resolve(strategy)).default(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
};
