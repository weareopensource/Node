/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));

const TasksService = require('../services/tasks.service');

/**
 * @desc Endpoint to ask the service to get the list of tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const tasks = await TasksService.list();
    responses.success(res, 'task list')(tasks);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to create a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.create = async (req, res) => {
  try {
    const task = await TasksService.create(req.body, req.user);
    responses.success(res, 'task created')(task);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to show the current task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = (req, res) => {
  const task = req.task ? req.task.toJSON() : {};
  responses.success(res, 'task get')(task);
};

/**
 * @desc Endpoint to ask the service to update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  // TODO if (req.task && req.user && req.task.user && req.task.user.id === req.user.id) next();
  try {
    const task = await TasksService.update(req.task, req.body);
    responses.success(res, 'task updated')(task);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
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
    responses.success(res, 'task deleted')({ id: req.task.id, ...result });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to get  stats of tasks and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.stats = async (req, res) => {
  const data = await TasksService.stats();
  if (!data.err) {
    responses.success(res, 'tasks stats')(data);
  } else {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(data.err))(data.err);
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
    if (!task) responses.error(res, 404, 'Not Found', 'No Task with that identifier has been found')();
    else {
      req.task = task;
      if (task.user) req.isOwner = task.user._id; // user id used if we proteck road by isOwner policy
      next();
    }
  } catch (err) {
    next(err);
  }
};
