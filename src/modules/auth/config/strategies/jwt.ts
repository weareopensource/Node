/**
 * Module dependencies
 */
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import * as UserService from '../../../users/services/user.service';

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.TOKEN;
  }
  return token;
};

async function verifyCallback(jwtPayload, done) {
  try {
    const user = await UserService.getBrut({ id: jwtPayload.userId });
    if (user) return done(null, user);

    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}

export default ({ jwt }) => {
  const opts: any = {
    jwtFromRequest: null,
    secretOrKey: undefined,
  };
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = jwt.secret;
  const strategy = new JwtStrategy(opts, verifyCallback);

  passport.use(strategy);
};
