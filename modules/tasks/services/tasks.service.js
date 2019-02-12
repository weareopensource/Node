/**
 * Module dependencies
 */
const TasksRepository = require('../repositories/tasks.repository');

/**
 * Service
 */
exports.get = async (id) => {
  const result = await TasksRepository.get(id);
  return Promise.resolve(result);
};

exports.create = async (task, user) => {
  task.user = user.id;

  const result = await TasksRepository.create(task);
  return Promise.resolve(result);
};

exports.update = async (task, body) => {
  task.title = body.title;
  task.description = body.description;

  const result = await TasksRepository.update(task);
  return Promise.resolve(result);
};

exports.delete = async (task) => {
  const result = await TasksRepository.delete(task);
  return Promise.resolve(result);
};

exports.list = async () => {
  const result = await TasksRepository.list();
  return Promise.resolve(result);
};
