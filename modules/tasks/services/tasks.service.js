/**
 * Module dependencies
 */
const TasksRepository = require('../repositories/tasks.repository');

/**
 * Service
 */
class TasksService {
  static async get(id) {
    const result = await TasksRepository.get(id);
    return Promise.resolve(result);
  }

  static async create(task, user) {
    task.user = user.id;

    const result = await TasksRepository.create(task);
    return Promise.resolve(result);
  }

  static async update(task, body) {
    task.title = body.title;
    task.description = body.description;

    const result = await TasksRepository.update(task);
    return Promise.resolve(result);
  }

  static async delete(task) {
    const result = await TasksRepository.delete(task);
    return Promise.resolve(result);
  }

  static async list() {
    const result = await TasksRepository.list();
    return Promise.resolve(result);
  }
}

module.exports = TasksService;
