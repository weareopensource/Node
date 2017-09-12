'use strict'

const passport = require('passport')
const passportJwt = require('passport-jwt')
const UserService = require('../../services/user.service')

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

module.exports = function (config) {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
  }, async (jwtPayload, done) => {
    try {
      const user = await UserService.getUserDeserializedById(jwtPayload.id)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: 'Incorrect token'
        })
      }
    } catch (err) {
      return done(err)
    }
  }))
}
