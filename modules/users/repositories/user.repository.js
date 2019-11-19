/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * @desc Function to get all user in db
 * @return {Array} All users
 */
exports.list = () => User.find({}, '-password -providerData').sort('-createdAt').exec();

/**
 * @desc Function to create a user in db
 * @param {Object} user
 * @return {Object} user
 */
exports.create = (user) => new User(user).save();

/**
 * @desc Function to get a user from db by id or email
 * @param {Object} user
 * @return {Object} user
 */
exports.get = (user) => {
  if (user.id && mongoose.Types.ObjectId.isValid(user.id)) return User.findOne({ _id: user.id }).exec();
  if (user.email) return User.findOne({ email: user.email }).exec();
  return null;
};

/**
 * @desc Function to get a search in db request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
exports.search = (input) => User.find(input).exec();

/**
 * @desc Function to update a user in db
 * @param {Object} user
 * @return {Object} user
 */
exports.update = (user) => new User(user).save();

/**
 * @desc Function to delete a user from db by id or email
 * @param {Object} user
 * @return {Object} confirmation of delete
 */
exports.delete = async (user) => {
  if (user.id && mongoose.Types.ObjectId.isValid(user.id)) return User.deleteOne({ _id: user.id }).exec();
  if (user.email) return User.deleteOne({ email: user.email }).exec();
  return null;
};
