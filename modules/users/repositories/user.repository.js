/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

class UserRepository {
  static create(user) {
    return new User(user).save();
  }

  static delete(user) {
    return new User(user).remove();
  }

  static getById(id) {
    return User.findOne({ _id: String(id) }).exec();
  }

  static getByEmail(email) {
    // @TODO change the user's model field to email to be consistent
    return User.findOne({ email }).exec();
  }
}

module.exports = UserRepository;
