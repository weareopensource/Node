'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = (req, res) => {
  res.send(req.model.toObject({ getters: true }));
};

/**
 * Update a User
 */
exports.update = (req, res) => {
  const user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.username = req.body.username;
  user.roles = req.body.roles;
  user.email = req.body.email;
  user.profileImageURL = req.body.profileImageURL;

  user.save(err => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user.toObject({ getters: true }));
  });
};

/**
 * Delete a user
 */
exports.delete = (req, res) => {
  const user = req.model;

  user.remove(err => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user.toObject({ getters: true }));
  });
};

/**
 * List of Users
 */
exports.list = (req, res) => {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec((err, users) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users.map(user => (user.toObject({ getters: true }))));
  });
};

/**
 * User middleware
 */
exports.userByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec((err, user) => {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
