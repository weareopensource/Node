/**
 * Module dependencies
 */
import * as TasksRepository from '../repositories/tasks.repository';

/**
 * @desc Function to get all task in db
 * @return {Promise} All tasks
 */
export async function list() {
  const result = await TasksRepository.list();
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to create a task
 * @param {Object} task
 * @return {Promise} task
 */
export async function create(task, user) {
  task.user = user.id;

  const result = await TasksRepository.create(task);
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to get a task
 * @param {String} id
 * @return {Promise} task
 */
export async function get(id): Promise<any> {
  const result = await TasksRepository.get(id);
  return Promise.resolve(result);
}

/**
 * @desc Functio to ask repository to update a task
 * @param {Object} task - original task
 * @param {Object} body - task edited
 * @return {Promise} task
 */
export async function update(task, body) {
  task.title = body.title;
  task.description = body.description;

  const result = await TasksRepository.update(task);
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to delete a task
 * @param {Object} task
 * @return {Promise} confirmation of delete
 */
export async function deleteTask(task) {
  const result = await TasksRepository.deleteTask(task);
  return Promise.resolve(result);
}

/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
export async function stats() {
  return TasksRepository.stats();
}
