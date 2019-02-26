/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const path = require('path');

const User = mongoose.model('User');
const ApiError = require(path.resolve('./lib/helpers/ApiError'));

/**
 * @desc Function to get a user from db by id
 * @param {String} id
 * @return {Object} user
 */
exports.getById = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError({ message: 'User id is invalid' });
  return User.findOne({ _id: id }).exec();
};

/**
 * @desc Function to get a user from db by id
 * @param {String} id
 * @return {Object} user
 */
exports.getByEmail = email => User.findOne({ email }).exec();

/**
 * @desc Function to create a user in db
 * @param {Object} user
 * @return {Object} user
 */
exports.create = user => new User(user).save();

/**
 * @desc Function to delete a user in db
 * @param {Object} user
 * @return {Object} confirmation of delete
 */
exports.delete = user => User.deleteOne({ _id: user.id }).exec();
