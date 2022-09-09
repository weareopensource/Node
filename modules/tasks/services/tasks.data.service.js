/**
 * Module dependencies
 */
import TasksRepository from "../repositories/tasks.repository.js"

/**
 * @desc Function to ask repository to get all task from a specific user
 * @param {Object} user
 * @return {Promise} user tasks
 */
const list = async (user) => {
  const result = await TasksRepository.list({ user: user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to remove all task from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
const remove = async (user) => {
  const result = await TasksRepository.removeMany({ user: user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to push a list of tasks
 * @param {[Object]} tasks
 * @param {[String]} filters
 * @return {Promise} tasks
 */
const push = (tasks, filters) => {
  const result = TasksRepository.push(tasks, filters);
  return result;
};

export default {
  list,
  remove,
  push
}