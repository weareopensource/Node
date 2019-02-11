/**
 * Module dependencies
 */
const path = require('path');

const errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));
const TasksService = require('../services/tasks.service');

/**
 * Show the current task
 */
exports.read = (req, res) => {
  const task = req.task ? req.task.toJSON() : {};
  res.json(task);
};

/**
 * Create an task
 */
exports.create = async (req, res) => {
  const user = req.user;
  if (!user) res.status(404).send({ message: 'User not defined' });

  try {
    const task = await TasksService.create(req.body, req.user);
    res.json(task);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * Update a task
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
 * Delete a task
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
 * List of Tasks
 */
exports.list = async (req, res) => {
  try {
    const tasks = await TasksService.list(req.task);
    res.json(tasks);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * Task middleware
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
