/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const UserService = require('../../services/user.service');

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  try {
    const user = await UserService.update(req.user, req.body);
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'user updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to update the terms sign of the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.terms = async (req, res) => {
  try {
    const user = await UserService.terms(req.user);
    responses.success(res, 'user terms signed')(user);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to delete the user connected
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = await UserService.delete(req.user);
    responses.success(res, 'user deleted')({ id: req.user.id, ...result });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to sanitize the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.me = (req, res) => {
  // Sanitize the user - short term solution. Copied from core.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  let user = null;
  if (req.user) {
    user = {
      id: req.user.id,
      provider: escape(req.user.provider),
      roles: req.user.roles,
      avatar: req.user.avatar,
      email: escape(req.user.email),
      lastName: escape(req.user.lastName),
      firstName: escape(req.user.firstName),
      providerData: req.user.providerData,
      // others
      complementary: req.user.complementary,
    };
    if (req.user.bio) user.bio = req.user.bio;
    if (req.user.position) user.position = req.user.position;
    // startup requirement
    if (req.user.terms) user.terms = req.user.terms;
  }
  return responses.success(res, 'user get')(user);
};
