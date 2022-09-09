/**
 * Module dependencies
 */
import errors from "../../../lib/helpers/errors.js"
import responses from "../../../lib/helpers/responses.js";
import UserService from "../services/user.service.js";

/**
 * @desc Endpoint to ask the service to get the list of users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const list = async (req, res) => {
  try {
    const users = await UserService.list(req.search, req.page, req.perPage);
    responses.success(res, 'user list')(users);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to get the current user in req
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const get = (req, res) => {
  const user = req.model ? req.model.toJSON() : {};
  responses.success(res, 'user get')(user);
};

/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
  try {
    const user = await UserService.update(req.model, req.body, 'admin');
    responses.success(res, 'user updated')(user);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to remove a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const remove = async (req, res) => {
  try {
    const result = await UserService.remove(req.model);
    responses.success(res, 'user deleted')({ id: req.model.id, ...result });
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to get stats of users and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const stats = async (req, res) => {
  const data = await UserService.stats();
  if (!data.err) {
    responses.success(res, 'users stats')(data);
  } else {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(data.err))(data.err);
  }
};

/**
 * @desc MiddleWare to ask the service the user for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - user id
 */
const userByID = async (req, res, next, id) => {
  try {
    const user = await UserService.getBrut({ id });
    if (!user) responses.error(res, 404, 'Not Found', 'No User with that identifier has been found')();
    else {
      req.model = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @desc MiddleWare to check the params
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function  ...pagenumber&perpage&search
 * @param {String} params - params
 */
const userByPage = async (req, res, next, params) => {
  try {
    if (!params) responses.error(res, 404, 'Not Found', 'No users with that params has been found')();
    const request = params.split('&');
    if (request.length > 3) responses.error(res, 422, 'Not Found', 'That search countain more than 3 params')();
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
};

export default {
  list,
  get,
  update,
  remove,
  stats,
  userByID,
  userByPage
}