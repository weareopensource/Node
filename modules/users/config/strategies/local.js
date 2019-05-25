/**
 * Module dependencies
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../../services/user.service');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await UserService.authenticate(email, password);
      if (user) return done(null, user);

      return done(null, false, {
        message: 'Invalid email or password',
      });
    } catch (err) {
      return done();
    }
  }));
};
