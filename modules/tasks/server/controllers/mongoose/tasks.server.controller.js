/**
 * Module dependencies
 */
const path = require('path');
const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current task
 */
exports.read = (req, res) => {
  // convert mongoose document to JSON
  const task = req.task ? req.task.toJSON() : {};
  res.json(task.toObject({ getters: true }));
};

/**
 * Create an task
 */
exports.create = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).send({
      message: 'User not defined'
    });
  }
  const task = new Task(req.body);

  task.user = req.user.id;

  task.save().then(task => {
    res.json(task.toObject({ getters: true }));
  }).catch(err => {
    console.log(err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update a task
 */
exports.update = (req, res) => {
  const task = req.task;
  task.title = req.body.title;
  task.description = req.body.description;

  task.save().then(task => {
    res.json(task.toObject({ getters: true }));
  }).catch(err => {
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete a task
 */
exports.delete = (req, res) => {
  const task = req.task;

  task.remove().then(task => {
    res.json({ taskId: task.id });
  }).catch(err => {
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Tasks
 */
exports.list = (req, res) => {
  Task.find().sort('-created').exec().then(tasks => {
    res.json(tasks.map(task => (task.toObject({ getters: true }))));
  })
    .catch(err => {
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Tasks for one username
 */
exports.userList = (req, res) => {
  if (!req.user) {
    return res.status(404).send({
      message: 'User not defined'
    });
  }

  Task.find({
    user: req.user.id
  }).sort('-created').exec().then(tasks => {
    res.json(tasks.map(task => task.toObject({ getters: true })));
  })
    .catch(err => {
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Task middleware
 */
exports.taskByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Task is invalid'
    });
  }

  Task.findById(id).exec().then(task => {
    if (!task) {
      return res.status(404).send({
        message: 'No Task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  }).catch(err => next(err));
};
