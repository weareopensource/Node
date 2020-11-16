/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));

const HomeService = require('../services/home.service');

/**
 * @desc Endpoint to ask the service to get the releases
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.releases = async (req, res) => {
  try {
    const releases = await HomeService.releases();
    responses.success(res, 'releases')(releases);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to get the changelogs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.changelogs = async (req, res) => {
  try {
    const changelogs = await HomeService.changelogs();
    responses.success(res, 'changelogs')(changelogs);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to get the list of users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.team = async (req, res) => {
  try {
    const users = await HomeService.team();
    responses.success(res, 'team list')(users);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
