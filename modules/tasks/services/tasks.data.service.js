/**
 * Module dependencies
 */
import TasksRepository from '../repositories/tasks.repository.js';

/**
 * @function list
 * @description Service to fetch all tasks for a specific user from the repository
 * @param {Object} user - The user for whom to fetch tasks
 * @return {Promise} A promise that resolves to the list of tasks for the user
 */
const list = async (user) => {
  const result = await TasksRepository.list({ user: user._id });
  return Promise.resolve(result);
};

/**
 * @function push
 * @description Service to push a list of tasks to the repository
 * @param {[Object]} tasks - The list of tasks to push
 * @param {[String]} filters - The list of filters to apply
 * @return {Promise} A promise that resolves to the pushed tasks
 */
const push = (tasks, filters) => {
  const result = TasksRepository.push(tasks, filters);
  return result;
};

/**
 * @function remove
 * @description Service to remove all tasks for a specific user from the repository
 * @param {Object} user - The user for whom to remove tasks
 * @return {Promise} A promise that resolves to a confirmation of deletion
 */
const remove = async (user) => {
  const result = await TasksRepository.deleteMany({ user: user._id });
  return Promise.resolve(result);
};

export default {
  list,
  remove,
  push,
};
