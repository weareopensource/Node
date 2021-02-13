/**
 * Module dependencies
 */
import { Response } from 'express';
import AppError from '../../../../lib/helpers/AppError';
import getMessage from '../../../../lib/helpers/errors';
import { NodeRequest, error, success } from '../../../../lib/helpers/responses';
import * as UploadsService from '../../../uploads/services/uploads.service';
import * as UserService from '../../services/user.service';

/**
 * @desc Endpoint to ask the service to update a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function updateAvatar(req: NodeRequest, res: Response) {
  try {
    // catch multerErr
    if (req.multerErr) throw new AppError(req.multerErr.message, { code: 'SERVICE_ERROR', details: req.multerErr });
    // delete old image
    if (req.user.avatar) await UploadsService.deleteUpload({ filename: req.user.avatar });
    // update document uploaded (metadata ...)
    const result = await UploadsService.update(req.file, req.user, 'avatar');
    // update user
    const user = await UserService.update(req.user, { avatar: result.filename });
    // reload playload
    req.login(user, (errLogin) => {
      if (errLogin) return error(res, 400, 'Bad Request', getMessage(errLogin))(errLogin);
      return success(res, 'profile avatar updated')(user);
    });
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to delete a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteAvatar(req: NodeRequest, res: Response) {
  try {
    if (req.user.avatar) await UploadsService.deleteUpload({ filename: req.user.avatar });
    // update user
    const user = await UserService.update(req.user, { avatar: '' });
    // reload playload
    req.login(user, (errLogin) => {
      if (errLogin) return error(res, 400, 'Bad Request', getMessage(errLogin))(errLogin);
      return success(res, 'profile avatar updated')(user);
    });
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}
