/**
 * Module dependencies
 */
const TasksRepository = require('../repositories/tasks.repository');

/**
 * @desc Function to ask repository to get all task from a specific user
 * @param {Object} user
 * @return {Promise} user tasks
 */
exports.userList = async (user) => {
  const result = await TasksRepository.userlist(user);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete all task from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
exports.userDelete = async (user) => {
  const result = await TasksRepository.userdelete(user);
  return Promise.resolve(result);
};
