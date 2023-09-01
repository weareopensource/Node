/**
 * Module dependencies
 */
import TasksRepository from '../repositories/tasks.repository.js';

/**
 * @function list
 * @description Service to retrieve all tasks in the database
 * @return {Promise} A promise that resolves to the list of all tasks
 */
const list = async () => {
  const result = await TasksRepository.list();
  return Promise.resolve(result);
};

/**
 * @function create
 * @description Service to create a new task.
 * @param {Object} body - The object containing task details such as title and description.
 * @param {Object} user - The user creating the task.
 * @returns {Promise} A promise resolving to the newly created task.
 */
const create = async (body, user) => {
  const task = {};
  task.title = body.title;
  task.description = body.description;
  task.user = user.id;

  const result = await TasksRepository.create(task);
  return Promise.resolve(result);
};

/**
 * @function get
 * @description Service to fetch a single task by its ID.
 * @param {String} id - The ID of the task to fetch.
 * @returns {Promise} A promise resolving to the retrieved task.
 */
const get = async (id) => {
  const result = await TasksRepository.get(id);
  return Promise.resolve(result);
};

/**
 * @function update
 * @description Service to update an existing task.
 * @param {Object} task - The existing task object.
 * @param {Object} body - The object containing updated task details.
 * @returns {Promise} A promise resolving to the updated task.
 */
const update = async (task, body) => {
  task.title = body.title;
  task.description = body.description;

  const result = await TasksRepository.update(task);
  return Promise.resolve(result);
};

/**
 * @function remove
 * @description Service to delete a task.
 * @param {Object} task - The task to delete.
 * @returns {Promise} A promise resolving to a confirmation of the deletion.
 */
const remove = async (task) => {
  const result = await TasksRepository.remove(task);
  return Promise.resolve(result);
};

/**
 * @function stats
 * @description Service to fetch statistical data about tasks in the database.
 * @returns {Promise} A promise resolving to the statistical data.
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
