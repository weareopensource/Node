/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const UserService = require('../services/user.service');

/**
 * @desc Endpoint to ask the service to get the list of users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const users = await UserService.list();
    responses.success(res, 'user list')(users);
  } catch (err) {
    responses.error(
      res,
      422,
      'Unprocessable Entity',
      errors.getMessage(err),
    )(err);
  }
};

/**
 * @desc Endpoint to get the current user in req
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = (req, res) => {
  const user = req.model ? req.model.toJSON() : {};
  responses.success(res, 'user get')(user);
};

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  try {
    const user = await UserService.update(req.model, req.body, 'admin');
    responses.success(res, 'user updated')(user);
  } catch (err) {
    responses.error(
      res,
      422,
      'Unprocessable Entity',
      errors.getMessage(err),
    )(err);
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
    responses.success(res, 'user deleted')(result);
  } catch (err) {
    responses.error(
      res,
      422,
      'Unprocessable Entity',
      errors.getMessage(err),
    )(err);
  }
};

/**
 * @desc Endpoint to get stats of users and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.stats = async (req, res) => {
  const data = await UserService.stats();
  if (!data.err) {
    responses.success(res, 'users stats')(data);
  } else {
    responses.error(
      res,
      422,
      'Unprocessable Entity',
      errors.getMessage(data.err),
    )(data.err);
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
    const user = await UserService.getBrut({ id });
    if (!user)
      responses.error(
        res,
        404,
        'Not Found',
        'No User with that identifier has been found',
      )();
    else {
      req.model = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};
