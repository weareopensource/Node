/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');

const config = require(path.resolve('./config'));
const authService = require(path.resolve('modules/auth/services/auth.service'));
const UserRepository = require('../repositories/user.repository');

/**
 * @desc Local function to removeSensitive data from user
 * @param {Object} user
 * @return {Object} user
 */
exports.removeSensitive = (user, conf) => {
  if (!user || typeof user !== 'object') return null;
  const keys = conf || config.whitelists.users.default;
  return _.pick(user, keys);
};

/**
 * @desc Function to get all users in db
 * @param {String} search
 * @param {Int} page
 * @param {Int} perPage
 * @return {Promise} users selected
 */
exports.list = async (search, page, perPage) => {
  const result = await UserRepository.list(search, page, perPage);
  return Promise.resolve(result.map((user) => this.removeSensitive(user)));
};

/**
 * @desc Function to ask repository to create a  user (define provider, check & haspassword, save)
 * @param {Object} user
 * @return {Promise} user
 */
exports.create = async (user) => {
  // Set provider to local
  if (!user.provider) user.provider = 'local';
  // confirming to secure password policies
  if (user.password) {
    // done in model, let this comment for information if one day joi.zxcvbn is not ok / sufficient
    // const validPassword = zxcvbn(user.password);
    // if (!validPassword || !validPassword.score || validPassword.score < config.zxcvbn.minimumScore) {
    //   throw new AppError(`${validPassword.feedback.warning}. ${validPassword.feedback.suggestions.join('. ')}`);
    // }
    // When password is provided we need to make sure we are hashing it
    user.password = await authService.hashPassword(user.password);
  }
  const result = await UserRepository.create(user);
  // Remove sensitive data before return
  return Promise.resolve(this.removeSensitive(result));
};

/**
 * @desc Function to ask repository to search users by request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
exports.search = async (input) => {
  const result = await UserRepository.search(input);
  return Promise.resolve(result.map((user) => this.removeSensitive(user)));
};

/**
 * @desc Function to ask repository to get a user by id or email
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
exports.get = async (user) => {
  const result = await UserRepository.get(user);
  return Promise.resolve(this.removeSensitive(result));
};

/**
 * @desc Function to ask repository to get a user by id or email without filter data return (test & intern usage)
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
exports.getBrut = async (user) => {
  const result = await UserRepository.get(user);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to update a user
 * @param {Object} user - original user
 * @param {Object} body - user edited
 * @param {boolean} admin - true if admin update
 * @return {Promise} user -
 */
exports.update = async (user, body, option) => {
  if (!option) user = _.assignIn(user, this.removeSensitive(body, config.whitelists.users.update));
  else if (option === 'admin') user = _.assignIn(user, this.removeSensitive(body, config.whitelists.users.updateAdmin));
  else if (option === 'recover') user = _.assignIn(user, this.removeSensitive(body, config.whitelists.users.recover));

  const result = await UserRepository.update(user);
  return Promise.resolve(this.removeSensitive(result));
};

/**
 * @desc Functio to ask repository to sign terms for current user
 * @param {Object} user - original user
 * @return {Promise} user -
 */
exports.terms = async (user) => {
  user = _.assignIn(user, { terms: new Date() });
  const result = await UserRepository.update(user);
  return Promise.resolve(this.removeSensitive(result));
};

/**
 * @desc Function to ask repository to a user from db by id or email
 * @param {Object} user
 * @return {Promise} result & id
 */
exports.delete = async (user) => {
  const result = await UserRepository.delete(user);
  return Promise.resolve(result);
};

/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
exports.stats = async () => {
  const result = await UserRepository.stats();
  return Promise.resolve(result);
};
