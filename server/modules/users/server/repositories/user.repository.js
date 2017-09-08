'use strict'

const path = require('path')
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'))
const mongoose = require('mongoose')
const passport = require('passport')
const User = mongoose.model('User')

class UserRepository {
  static create (userObj) {
    const user = new User(userObj)
    return user.save()
  }

  static getById (id) {
    return User.findOne({_id: String(id)}).exec()
  }

  static getByEmail (email) {
    // @TODO change the user's model field to email to be consistent
    return User.findOne({username: String(email)}).exec()
  }
}

module.exports = UserRepository
