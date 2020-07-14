/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));

const HistorysService = require('../services/historys.service');

/**
 * @desc Endpoint to ask the service to get the list of historys
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const historys = await HistorysService.list(req.user);
    responses.success(res, 'history list')(historys);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to show the current history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = (req, res) => {
  const history = req.history ? req.history.toJSON() : {};
  responses.success(res, 'history get')(history);
};

/**
 * @desc Endpoint to get stats of historys and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.stats = async (req, res) => {
  const data = await HistorysService.stats();
  if (!data.err) {
    responses.success(res, 'Historys stats')(data);
  } else {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(data.err))(data.err);
  }
};

/**
 * @desc MiddleWare to ask the service the history for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - history id
 */
exports.historyByID = async (req, res, next, id) => {
  try {
    const history = await HistorysService.get(id);
    if (!history) responses.error(res, 404, 'Not Found', 'No history with that identifier has been found')();
    else {
      req.history = history;
      req.isOwner = history.user; // used if we proteck road by isOwner policy
      next();
    }
  } catch (err) {
    next(err);
  }
};
