/**
 * Module dependencies
 */
import TasksRepository from '../repositories/tasks.repository.js';

/**
 * @desc Function to get all task in db
 * @return {Promise} All tasks
 */
const list = async () => {
  const result = await TasksRepository.list();
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to create a task
 * @param {Object} task
 * @return {Promise} task
 */
const create = async (task, user) => {
  task.user = user.id;

  const result = await TasksRepository.create(task);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get a task
 * @param {String} id
 * @return {Promise} task
 */
const get = async (id) => {
  const result = await TasksRepository.get(id);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to update a task
 * @param {Object} task - original task
 * @param {Object} body - task edited
 * @return {Promise} task
 */
const update = async (task, body) => {
  task.title = body.title;
  task.description = body.description;

  const result = await TasksRepository.update(task);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to remove a task
 * @param {Object} task
 * @return {Promise} confirmation of delete
 */
const remove = async (task) => {
  const result = await TasksRepository.remove(task);
  return Promise.resolve(result);
};

/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
const stats = async () => {
  const result = await TasksRepository.stats();
  return Promise.resolve(result);
};

export default {
  list,
  create,
  get,
  update,
  remove,
  stats,
};
