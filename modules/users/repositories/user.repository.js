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
    return User.deleteOne({ _id: user.id }).exec();
  }

  static getById(id) {
    return User.findOne({ _id: String(id) }).exec();
  }

  static getByEmail(email) {
    return User.findOne({ email }).exec();
  }
}

module.exports = UserRepository;
