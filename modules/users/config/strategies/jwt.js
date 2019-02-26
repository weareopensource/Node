/**
 * Module dependencies
 */
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const UserService = require('../../services/user.service');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.TOKEN;
  }
  return token;
};

async function verifyCallback(jwtPayload, done) {
  try {
    const user = await UserService.get({ id: jwtPayload.userId });
    if (user) return done(null, user);

    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}

module.exports = ({ jwt }) => {
  const opts = {};
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = jwt.secret;
  const strategy = new JwtStrategy(opts, verifyCallback);

  passport.use(strategy);
};
