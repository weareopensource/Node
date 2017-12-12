'use strict'

/**
 * Module dependencies
 */
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const User = require('mongoose').model('User')
const UserService = require('../../services/user.service')

module.exports = function (config) {
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await UserService.authenticate(email, password)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: 'Invalid username or password'
        })
      }
    } catch (err) {
      return done();
    }
  }))
}
