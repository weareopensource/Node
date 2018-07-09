/**
 * Module dependencies
 */
const passport = require('passport');
const passportJwt = require('passport-jwt');
const UserService = require('../../services/user.service');

const JwtStrategy = passportJwt.Strategy;
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies.TOKEN;

  return token;
};

async function verifyCallback(jwtPayload, done) {
  try {
    console.log(jwtPayload);
    const user = await UserService.getUserDeserializedById(jwtPayload.userId);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err);
  }
}

module.exports = ({ jwt }) => {
  const opts = {};
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = jwt.secret;

  const strategy = new JwtStrategy(opts, verifyCallback);

  passport.use(strategy);
};
