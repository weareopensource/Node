/**
 * Module dependencies
 */
const TasksRepository = require('../repositories/tasks.repository');

/**
 * @desc Function to get all task in db
 * @return {Promise} All tasks
 */
exports.list = async () => {
  const result = await TasksRepository.list();
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to create a task
 * @param {Object} task
 * @return {Promise} task
 */
exports.create = async (task, user) => {
  task.user = user.id;

  const result = await TasksRepository.create(task);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get a task
 * @param {String} id
 * @return {Promise} task
 */
exports.get = async (id) => {
  const result = await TasksRepository.get(id);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to update a task
 * @param {Object} task - original task
 * @param {Object} body - task edited
 * @return {Promise} task
 */
exports.update = async (task, body) => {
  task.title = body.title;
  task.description = body.description;

  const result = await TasksRepository.update(task);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete a task
 * @param {Object} task
 * @return {Promise} confirmation of delete
 */
exports.delete = async (task) => {
  const result = await TasksRepository.delete(task);
  return Promise.resolve(result);
};

/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
exports.stats = async () => {
  const result = await TasksRepository.stats();
  return Promise.resolve(result);
};
