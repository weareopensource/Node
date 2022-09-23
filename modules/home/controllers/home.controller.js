/**
 * Module dependencies
 */
import fs from 'fs';

import errors from '../../../lib/helpers/errors.js';
import responses from '../../../lib/helpers/responses.js';
import HomeService from '../services/home.service.js';

/**
 * @desc Endpoint to ask the service to get the releases
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const releases = async (req, res) => {
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
const changelogs = async (req, res) => {
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
const team = async (req, res) => {
  try {
    const users = await HomeService.team();
    responses.success(res, 'team list')(users);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to get a page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const page = async (req, res) => {
  try {
    responses.success(res, 'page')(req.page);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc MiddleWare to ask the service the file for this name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} name - file name
 */
const pageByName = async (req, res, next, name) => {
  try {
    if (!fs.existsSync(`./config/markdown/${name}.md`)) return responses.error(res, 404, 'Not Found', 'No page with that name has been found')();
    const page = await HomeService.page(name);
    req.page = page;
    next();
  } catch (err) {
    next(err);
  }
};

export default {
  releases,
  changelogs,
  team,
  page,
  pageByName,
};
