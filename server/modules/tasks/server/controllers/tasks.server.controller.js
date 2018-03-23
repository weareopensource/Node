'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  orm = require(path.resolve('./lib/services/sequelize'));

exports.getAllTasks = function (req, res) {

  orm.Task.findAll().then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    console.log(error)
    res.status(500).send(error);
  });

};

exports.addTask = function (req, res) {

  // Reject the request if no title field is provided
  if (!req.body.title) {
    return res.status(400).send({
      message: 'Missing title field'
    });
  }

  // Coerce the title field to string
  let title = '' + req.body.title;
  let description = '' + req.body.description;

  let username = req.user.username;

  orm.Task.create({
    title: title,
    description: description,
    username: username
  }).then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};

exports.updateTask = function (req, res) {
  orm.Task.update(
    { description: req.body.description, title: req.body.title },
    { where: { id: req.body.id }
  }).then(function (task) {
    res.status(200).send(req.body);
  }).catch(function (error) {
    console.log(error)
    res.status(500).send(error);
  });

};

exports.deleteTask = function (req, res) {

  const taskId = req.params.id

  orm.Task.destroy({
    where: {
      id: taskId
    }
  }).then(function (tasks) {
    res.status(200).send({ taskId });
  }).catch(function (error) {
    res.status(500).send(error);
  });

};

exports.getMyTasks = function (req, res) {

  orm.Task.findAll({
    where: {
      username: req.user.username
    }
  }).then(function (tasks) {
    res.status(200).send(tasks);
  }).catch(function (error) {
    res.status(500).send(error);
  });

};


// Helper method to validate a valid session for dependent APIs
exports.validateSessionUser = function (req, res, next) {
  // Reject the request if no user exists on the session
  if (!req.user) {
    return res.status(401).send({
      message: 'No session user'
    });
  }

  return next();
};
