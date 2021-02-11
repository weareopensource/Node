/**
 * Module dependencies
 */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { authenticate } from '../../services/auth.service';

export default () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await authenticate(email, password);
      if (user) return done(null, user);

      return done(null, false, {
        message: 'Invalid email or password',
      });
    } catch (err) {
      return done();
    }
  }));
}
