/**
 * Module dependencies
 */
import path from "path";

import AppError from "../../../lib/helpers/AppError.js"
import errors from "../../../lib/helpers/errors.js"
import responses from "../../../lib/helpers/responses.js";
import UploadsService from "../../uploads/services/uploads.service.js"
import UserService from "../services/user.service.js";

/**
 * @desc Endpoint to ask the service to update a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAvatar = async (req, res) => {
  try {
    // catch multerErr
    if (req.multerErr) throw new AppError(req.multerErr.message, { code: 'SERVICE_ERROR', details: req.multerErr });
    // delete old image
    if (req.user.avatar) await UploadsService.remove({ filename: req.user.avatar });
    // update document uploaded (metadata ...)
    const result = await UploadsService.update(req.file, req.user, 'avatar');
    // update user
    const user = await UserService.update(req.user, { avatar: result.filename });
    // reload playload
    req.login(user, { session: false }, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'profile avatar updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to remove a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeAvatar = async (req, res) => {
  try {
    if (req.user.avatar) await UploadsService.remove({ filename: req.user.avatar });
    // update user
    const user = await UserService.update(req.user, { avatar: '' });
    // reload playload
    req.login(user, { session: false }, (errLogin) => {
      if (errLogin) return responses.error(res, 400, 'Bad Request', errors.getMessage(errLogin))(errLogin);
      return responses.success(res, 'profile avatar updated')(user);
    });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

export default {
  updateAvatar,
  removeAvatar
}