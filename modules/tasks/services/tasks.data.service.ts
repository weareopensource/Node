/**
 * Module dependencies
 */
import * as TasksRepository from '../repositories/tasks.repository';
/**
 * @desc Function to ask repository to get all task from a specific user
 * @param {Object} user
 * @return {Promise} user tasks
 */
export async function list(user) {
  const result = await TasksRepository.list({ user: user._id });
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to delete all task from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
export async function deleteTask(user) {
  const result = await TasksRepository.deleteMany({ user: user._id });
  return Promise.resolve(result);
}

export function importTask(tasks, filters) {
  return TasksRepository.importTask(tasks, filters);
}
