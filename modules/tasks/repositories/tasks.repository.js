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
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError({ message: 'Task is invalid' });
  return Task.findOne({ _id: id }).exec();
};

exports.create = task => new Task(task).save();

exports.update = task => new Task(task).save();

exports.delete = task => Task.deleteOne({ _id: task.id }).exec();

exports.list = () => Task.find().sort('-created').exec();
