/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));

const ApisService = require('../services/apis.service');

/**
 * @desc Endpoint to ask the service to get the list of apis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const apis = await ApisService.list(req.user);
    responses.success(res, 'api list')(apis);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to create a api
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.create = async (req, res) => {
  try {
    const api = await ApisService.create(req.body, req.user);
    responses.success(res, 'api created')(api);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to show the current api
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = (req, res) => {
  const api = req.api ? req.api.toJSON() : {};
  responses.success(res, 'api get')(api);
};

/**
 * @desc Endpoint to ask the service to update a api
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  // TODO if (req.api && req.user && req.api.user && req.api.user.id === req.user.id) next();
  try {
    const api = await ApisService.update(req.api, req.body);
    responses.success(res, 'api updated')(api);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to delete a api
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = await ApisService.delete(req.api);
    result.id = req.api.id;
    responses.success(res, 'api deleted')(result);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to load the request of the api to the api
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.load = async (req, res) => {
  // TODO if (req.scrap && req.user && req.scrap.user && req.scrap.user.id === req.user.id) next();
  const data = await ApisService.load(req.api, req.user);
  if (!data.err) {
    responses.success(res, 'api loaded')(data);
  } else {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(data.err))(data.err);
  }
};

/**
 * @desc Endpoint to getData stocked from load on apis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.listApi = async (req, res) => {
  // TODO if (req.scrap && req.user && req.scrap.user && req.scrap.user.id === req.user.id) next();
  try {
    const data = await ApisService.listApi(req.api);
    responses.success(res, 'api getData')(data);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to getData stocked from load on apis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getApi = async (req, res) => {
  // TODO if (req.scrap && req.user && req.scrap.user && req.scrap.user.id === req.user.id) next();
  try {
    const data = await ApisService.getApi(req.api, req.body);
    responses.success(res, 'api getData')(data);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to getData Aggregated saved from load on apis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAggregateApi = async (req, res) => {
  // TODO if (req.scrap && req.user && req.scrap.user && req.scrap.user.id === req.user.id) next();
  try {
    const data = await ApisService.getAggregateApi(req.api, req.body);
    responses.success(res, 'api getData')(data);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc MiddleWare to ask the service the api for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - api id
 */
exports.apiByID = async (req, res, next, id) => {
  try {
    const api = await ApisService.get(id);
    if (!api) responses.error(res, 404, 'Not Found', 'No Api with that identifier has been found')();
    else {
      req.api = api;
      req.isOwner = api.user;
      next();
    }
  } catch (err) {
    next(err);
  }
};
