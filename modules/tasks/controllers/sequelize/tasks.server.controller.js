// /**
//  * Module dependencies
//  */
// const path = require('path');

// const orm = require(path.resolve('./lib/services/sequelize'));
// const errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));

// /**
//  * Show the current task
//  */
// exports.read = (req, res) => {
//   // convert mongoose document to JSON
//   const task = req.task ? req.task.toJSON() : {};
//   res.json(task);
// };

// /**
//  * Create an task
//  */
// exports.create = (req, res) => {
//   if (!req.user || !req.user.username) {
//     res.status(404).send({
//       message: 'User not defined',
//     });
//   } else {
//     const newTask = req.body;
//     newTask.user = req.user.username;

//     orm.Task.create(newTask)
//       .then(task => res.status(201).send(task))
//       .catch(err => res.status(422).send({
//         message: errorHandler.getErrorMessage(err),
//       }));
//   }
// };

// /**
//  * Update a task
//  */
// exports.update = (req, res) => {
//   const task = req.task;
//   task.title = req.body.title;
//   task.description = req.body.description;

//   orm.Task.update({
//     description: task.description,
//     title: task.title,
//   }, {
//     where: {
//       id: task.id,
//     },
//   }).then(() => {
//     res.status(200).send(req.body); // TODO: Do not send the body but the task from db or nothing
//   }).catch((err) => {
//     res.status(422).send({
//       message: errorHandler.getErrorMessage(err),
//     });
//   });
// };

// /**
//  * Delete a task
//  */
// exports.delete = (req, res) => {
//   const taskId = req.task.id;

//   orm.Task.destroy({
//     where: {
//       id: taskId,
//     },
//   }).then((task) => {
//     res.status(200).send(task);
//   }).catch((err) => {
//     res.status(422).send({
//       message: errorHandler.getErrorMessage(err),
//     });
//   });
// };

// /**
//  * List of Tasks
//  */
// exports.list = (req, res) => {
//   orm.Task.findAll().then((tasks) => {
//     res.status(200).send(tasks);
//   }).catch((err) => {
//     res.status(422).send({
//       message: errorHandler.getErrorMessage(err),
//     });
//   });
// };

// /**
//  * List of Tasks for one username
//  */
// exports.userList = (req, res) => {
//   if (!req.user || !req.user.username) {
//     res.status(404).send({
//       message: 'User not defined',
//     });
//   } else {
//     orm.Task.findAll({
//       where: {
//         user: req.user.username,
//       },
//     }).then((tasks) => {
//       res.status(200).send(tasks);
//     }).catch((err) => {
//       res.status(422).send({
//         message: errorHandler.getErrorMessage(err),
//       });
//     });
//   }
// };

// /**
//  * Task middleware
//  */
// exports.taskByID = (req, res, next, id) => {
//   // TODO Validate id format

//   orm.Task.findOne({ _id: id }).then((task) => {
//     if (!task) {
//       res.status(404).send({
//         message: 'No Task with that identifier has been found',
//       });
//     } else {
//       req.task = task;
//       next();
//     }
//   }).catch(err => next(err));
// };
