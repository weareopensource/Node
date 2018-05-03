/**
 * Module dependencies
 */
const path = require('path');
const orm = require(path.resolve('./lib/services/sequelize'));
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current task
 */
exports.read = (req, res) => {
  // convert mongoose document to JSON
  const task = req.task ? req.task.toJSON() : {};
  res.json(task);
};

/**
 * Create an task
 */
exports.create = (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(404).send({
      message: 'User not defined'
    });
  }

  const task = req.body;
  task.user = req.user.username;

  orm.Task.create(task).then(task => {
    res.status(200).send(task);
  }).catch(err => {
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

  orm.Task.update({
    description: task.description,
    title: task.title
  }, {
    where: {
      id: task.id
    }
  }).then(task => {
    res.status(200).send(req.body);
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

  orm.Task.destroy({
    where: {
      id: task.id
    }
  }).then(tasks => {
    res.status(200).send({
      taskId
    });
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
  orm.Task.findAll().then(tasks => {
    res.status(200).send(tasks);
  }).catch(err => {
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Tasks for one username
 */
exports.userList = (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(404).send({
      message: 'User not defined'
    });
  }

  orm.Task.findAll({
    where: {
      user: req.user.username
    }
  }).then(tasks => {
    res.status(200).send(tasks);
  }).catch(err => {
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Task middleware
 */
exports.taskByID = (req, res, next, id) => {
  // TODO Validate id format

  orm.Task.findById(id).then(task => {
    if (!task) {
      return res.status(404).send({
        message: 'No Task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  }).catch(err => next(err));
};


// // Helper method to validate a valid session for dependent APIs
// exports.validateSessionUser = function(req, res, next) {
//   // Reject the request if no user exists on the session
//   if (!req.user) {
//     return res.status(401).send({
//       message: 'No session user'
//     });
//   }
//
//   return next();
// };
