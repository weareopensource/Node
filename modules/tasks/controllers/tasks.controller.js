/**
 * Module dependencies
 */
const path = require('path');

const errorHandler = require(path.resolve('./modules/core/controllers/errors.controller'));
const TasksService = require('../services/tasks.service');

/**
 * @desc Endpoint to show the current task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.read = (req, res) => {
  const task = req.task ? req.task.toJSON() : {};
  res.json(task);
};

/**
 * @desc Endpoint to ask the service to create a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.create = async (req, res) => {
  try {
    const task = await TasksService.create(req.body, req.user);
    res.json(task);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc Endpoint to ask the service to update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  try {
    const task = await TasksService.update(req.task, req.body);
    res.json(task);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc Endpoint to ask the service to delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = await TasksService.delete(req.task);
    result.id = req.task.id;
    res.json(result);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc Endpoint to ask the service to get the list of tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const tasks = await TasksService.list();
    res.json(tasks);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc MiddleWare to ask the service the task for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - task id
 */
exports.taskByID = async (req, res, next, id) => {
  try {
    const task = await TasksService.get(id);
    if (!task) res.status(404).send({ message: 'No Task with that identifier has been found' });
    else {
      req.task = task;
      next();
    }
  } catch (err) {
    next(err);
  }
};
