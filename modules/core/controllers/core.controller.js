/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));

const CoreService = require('../services/core.service');

/**
 * @desc Endpoint to ask the service to get the releases
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.releases = async (req, res) => {
  try {
    const releases = await CoreService.releases();
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
    const changelogs = await CoreService.changelogs();
    responses.success(res, 'changelogs')(changelogs);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};
