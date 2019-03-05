/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const path = require('path');

const User = mongoose.model('User');
const ApiError = require(path.resolve('./lib/helpers/ApiError'));


/**
 * @desc Function to get a user from db by id or email
 * @param {Object} user
 * @return {Object} user
 */
exports.get = (user) => {
  if (user.id) {
    if (!mongoose.Types.ObjectId.isValid(user.id)) throw new ApiError('User id is invalid');
    return User.findOne({ _id: user.id }).exec();
  }
  if (user.email) return User.findOne({ email: user.email }).exec();
  if (user.username) return User.findOne({ username: user.username }).exec();
  throw new ApiError('User is invalid');
};

/**
 * @desc Function to get a search in db request
 * @param {Object} mongoose input request
 * @return {Object} user
 */
exports.search = input => User.findOne(input).exec();

/**
 * @desc Function to create a user in db
 * @param {Object} user
 * @return {Object} user
 */
exports.create = user => new User(user).save();

/**
 * @desc Function to update a user in db
 * @param {Object} task
 * @return {Object} task
 */
exports.update = user => new User(user).save();

/**
 * @desc Function to delete a user in db
 * @param {Object} user
 * @return {Object} confirmation of delete
 */
exports.delete = user => User.deleteOne({ _id: user.id }).exec();

/**
 * @desc Function to get all user in db
 * @return {Array} All users
 */
exports.list = () => User.find({}, '-salt -password -providerData').sort('-created').exec();
