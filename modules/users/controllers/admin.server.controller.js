/**
 * Module dependencies
 */
const path = require('path');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = ({ model }, res) => {
  res.send(model);
};

/**
 * Update a User
 */
exports.update = ({ model, body }, res) => {
  const user = model;

  // For security purposes only merge these parameters
  user.firstName = body.firstName;
  user.lastName = body.lastName;
  user.displayName = `${user.firstName} ${user.lastName}`;
  user.username = body.username;
  user.roles = body.roles;
  user.email = body.email;
  user.profileImageURL = body.profileImageURL;

  user.save((err) => {
    if (err) res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = ({ model }, res) => {
  const user = model;

  User.deleteOne({ _id: user.id }).exec((err) => {
    if (err) res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = (req, res) => {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec((err, users) => {
    if (err) res.status(422).send({ message: errorHandler.getErrorMessage(err) });
    else res.json(users.map(user => (user)));
  });
};

/**
 * User middleware
 */
exports.userByID = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ message: 'User is invalid' });
  } else {
    User.findOne({ _id: id }, '-salt -password -providerData').exec((err, user) => {
      if (err) next(err);

      if (!user) {
        next(new Error(`Failed to load user ${id}`));
      } else {
        req.model = user;
        next();
      }
    });
  }
};
