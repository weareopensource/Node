/**
 * Module dependencies
 */
const TasksRepository = require('../repositories/tasks.repository');

/**
 * @desc Function to ask repository to get all task from a specific user
 * @param {Object} user
 * @return {Promise} user tasks
 */
exports.list = async (user) => {
  const result = await TasksRepository.list({ user: user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete all task from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
exports.delete = async (user) => {
  const result = await TasksRepository.deleteMany({ user: user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to import a list of tasks
 * @param {[Object]} tasks
 * @param {[String]} filters
 * @return {Promise} tasks
 */
exports.import = (tasks, filters) => {
  const result = TasksRepository.import(tasks, filters);
  return result;
};
