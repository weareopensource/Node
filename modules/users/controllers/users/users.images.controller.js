/**
 * Module dependencies
 */
const path = require('path');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const UploadsService = require(path.resolve('./modules/uploads/services/uploads.service'));
const UserService = require('../../services/user.service');

/**
 * @desc Endpoint to ask the service to update a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAvatar = async (req, res) => {
  try {
    // catch multerErr
    if (req.multerErr) throw new AppError(req.multerErr.message, { code: 'SERVICE_ERROR', details: req.multerErr });
    // delete old image
    if (req.user.avatar) await UploadsService.delete({ filename: req.user.avatar });
    // update document uploaded (metadata ...)
    const result = await UploadsService.update(req.file, req.user, 'avatar');
    // update user
    const user = await UserService.update(req.user, { avatar: result.filename });
    // reload playload
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'profile avatar updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to delete a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteAvatar = async (req, res) => {
  try {
    if (req.user.avatar) await UploadsService.delete({ filename: req.user.avatar });
    // update user
    const user = await UserService.update(req.user, { avatar: '' });
    // reload playload
    req.login(user, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'profile avatar updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
