'use strict'

const passport = require('passport')
const passportJwt = require('passport-jwt')
const UserService = require('../../services/user.service')

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

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
  const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  const secretOrKey = config.jwt.secret

  const strategy = new JwtStrategy({jwtFromRequest, secretOrKey}, verifyCallback)

  passport.use(strategy)
}
