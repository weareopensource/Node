/**
 * Module dependencies
 */
const path = require('path');
const passport = require('passport');

const config = require(path.resolve('./config'));
const UserService = require(path.resolve('modules/users/services/user.service'));

/**
 * Module init function
 */
module.exports = (app) => {
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
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
};
