/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Task = mongoose.model('Task');

/**
 * @desc Function to get all task in db
 * @return {Array} All tasks
 */
exports.list = () => Task.find().sort('-createdAt').exec();

/**
 * @desc Function to create a task in db
 * @param {Object} task
 * @return {Object} task
 */
exports.create = (task) => new Task(task).save();

/**
 * @desc Function to get a task from db
 * @param {String} id
 * @return {Object} task
 */
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Task.findOne({ _id: id }).exec();
};

/**
 * @desc Function to update a task in db
 * @param {Object} task
 * @return {Object} task
 */
exports.update = (task) => new Task(task).save();

/**
 * @desc Function to delete a task in db
 * @param {Object} task
 * @return {Object} confirmation of delete
 */
exports.delete = (task) => Task.deleteOne({ _id: task.id }).exec();
