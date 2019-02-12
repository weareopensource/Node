/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const path = require('path');

const Task = mongoose.model('Task');
const ApiError = require(path.resolve('./lib/helpers/ApiError'));

/**
 * @desc Function to get a task from db
 * @param {String} id
 * @return {Object} Task
 */
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError({ message: 'Task is invalid' });
  return Task.findOne({ _id: id }).exec();
};

/**
 * @desc Function to create a task in db
 * @param {Object} task
 * @return {Object} Task
 */
exports.create = task => new Task(task).save();

/**
 * @desc Function to update a task in db
 * @param {Object} task
 * @return {Object} Task
 */
exports.update = task => new Task(task).save();

/**
 * @desc Function to delete a task in db
 * @param {Object} task
 * @return {Object} confirmation of delete
 */
exports.delete = task => Task.deleteOne({ _id: task.id }).exec();

/**
 * @desc Function to get all task in db
 * @return {Array} All tasks
 */
exports.list = () => Task.find().sort('-created').exec();
