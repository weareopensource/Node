/**
 * Module dependencies
 */
const path = require('path');

const errorHandler = require(path.resolve('./modules/core/controllers/errors.controller'));
const UserService = require('../services/user.service');

/**
 * @desc Endpoint to read the current user in req
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.read = (req, res) => {
  res.send(req.model);
};

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  try {
    const user = await UserService.update(req.model, req.body);
    res.json(user);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};


/**
 * @desc Endpoint to ask the service to delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = await UserService.delete(req.model);
    result.id = req.model.id;
    res.json(result);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc Endpoint to ask the service to get the list of users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const users = await UserService.list();
    res.json(users);
  } catch (err) {
    res.status(422).send({ message: errorHandler.getErrorMessage(err) });
  }
};

/**
 * @desc MiddleWare to ask the service the user for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - user id
 */
exports.userByID = async (req, res, next, id) => {
  try {
    const user = await UserService.get({ id });
    if (!user) res.status(404).send({ message: 'No User with that identifier has been found' });
    else {
      req.model = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};
