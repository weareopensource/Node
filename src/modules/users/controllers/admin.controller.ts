/**
 * Module dependencies
 */
import { Response } from 'express';
import getMessage from '../../../lib/helpers/errors';
import { error, NodeRequest, success } from '../../../lib/helpers/responses';
import * as UserService from '../services/user.service';

/**
 * @desc Endpoint to ask the service to get the list of users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function list(req: NodeRequest, res: Response) {
  try {
    const users = await UserService.list(req.search, req.page, req.perPage);
    success(res, 'user list')(users);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to get the current user in req
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function get(req: NodeRequest, res: Response) {
  const user = req.model ? req.model.toJSON() : {};
  success(res, 'user get')(user);
}

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function update(req: NodeRequest, res: Response) {
  try {
    const user = await UserService.update(req.model, req.body, 'admin');
    success(res, 'user updated')(user);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteUser(req: NodeRequest, res: Response) {
  try {
    const result = await UserService.deleteUser(req.model);
    result.id = req.model.id;
    success(res, 'user deleted')(result);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to get stats of users and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function stats(req: NodeRequest, res: Response) {
  try {
    const data = await UserService.stats();
    success(res, 'users stats')(data);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc MiddleWare to ask the service the user for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - user id
 */
export async function userByID(req, res, next, id) {
  try {
    const user = await UserService.getBrut({ id });
    if (!user) error(res, 404, 'Not Found', 'No User with that identifier has been found')();
    else {
      req.model = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @desc MiddleWare to check the params
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function  ...pagenumber&perpage&search
 * @param {String} params - params
 */
export async function userByPage(req, res, next, params) {
  try {
    if (!params) error(res, 404, 'Not Found', 'No users with that params has been found')();
    const request = params.split('&');
    if (request.length > 3) error(res, 422, 'Not Found', 'That search countain more than 3 params')();
    else {
      if (request.length === 3) {
        req.page = Number(request[0]);
        req.perPage = Number(request[1]);
        req.search = String(request[2]);
      } else if (request.length === 2) {
        req.page = Number(request[0]);
        req.perPage = Number(request[1]);
      } else {
        req.page = 0;
        req.perPage = 0;
      }
      next();
    }
  } catch (err) {
    next(err);
  }
}
