/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

class UserRepository {
  static create(userObj) {
    const user = new User(userObj);
    return user.save();
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
