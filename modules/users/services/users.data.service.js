/**
 * Module dependencies
 */
const UserRepository = require('../repositories/user.repository');

/**
 * @desc Function to ask repository to import a list of users
 * @param {[Object]} users
 * @param {[String]} filters
 * @return {Promise} users
 */
exports.import = (users, filters) => {
  const result = UserRepository.import(users, filters);
  return result;
};
