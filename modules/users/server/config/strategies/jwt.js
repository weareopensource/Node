'use strict'

const passport = require('passport')
const passportJwt = require('passport-jwt')
const UserService = require('../../services/user.service')
const config = require('../../../../../config')

const JwtStrategy = passportJwt.Strategy

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies.TOKEN;
  return token;
};

async function verifyCallback(jwtPayload, done) {
  try {
    const user = await UserService.getUserDeserializedById(jwtPayload.id)
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (err) {
    return done(err)
  }
}

module.exports = function (config) {

  var opts = {};
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = config.jwt.secret;

  const strategy = new JwtStrategy(opts, verifyCallback)

  passport.use(strategy)
}
