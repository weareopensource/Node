/**
 * Module dependencies
 */
import { Response } from 'express';
import getMessage from '../../../../lib/helpers/errors';
import * as UserService from '../../services/user.service';
import { NodeRequest, success, error } from '../../../../lib/helpers/responses';

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function update(req: NodeRequest, res: Response) {
  try {
    const user = await UserService.update(req.user, req.body);
    // reset login
    req.login(user, (errLogin) => {
      if (errLogin) return error(res, 400, 'Bad Request', getMessage(errLogin))(errLogin);
      return success(res, 'user updated')(user);
    });
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to update the terms sign of the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function terms(req: NodeRequest, res: Response) {
  try {
    const user = await UserService.terms(req.user);
    success(res, 'user terms signed')(user);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to delete the user connected
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteUser(req: NodeRequest, res: Response) {
  try {
    const result = await UserService.deleteUser(req.user);
    result.id = req.user.id;
    success(res, 'user deleted')(result);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to sanitize the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function me(req: NodeRequest, res: Response) {
  // Sanitize the user - short term solution. Copied from core.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  let user;
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
    if (terms) user.terms = terms;
  }
  return success(res, 'user get')(user);
}
