/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const path = require('path');

const Task = mongoose.model('Task');
const ApiError = require(path.resolve('./lib/helpers/ApiError'));

/**
 * Repository
 */
class TasksRepository {
  static get(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError({ message: 'Task is invalid' });
    return Task.findOne({ _id: id }).exec();
  }

  static create(task) {
    return new Task(task).save();
  }

  static update(task) {
    return new Task(task).save();
  }

  static delete(task) {
    return Task.deleteOne({ _id: task.id }).exec();
  }

  static list() {
    return Task.find().sort('-created').exec();
  }
}

module.exports = TasksRepository;
