/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));
const UploadsService = require('../services/uploads.service');

/**
 * @desc Endpoint to get an upload by fileName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = async (req, res) => {
  try {
    const stream = await UploadsService.getStream({ _id: req.upload._id });
    if (!stream) responses.error(res, 404, 'Not Found', 'No Upload with that identifier can been found')();
    stream.on('error', (err) => {
      responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
    });
    res.set('Content-Type', req.upload.contentType);
    stream.pipe(res);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to delete an upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    await UploadsService.delete({ _id: req.upload._id });
    responses.success(res, 'upload deleted')();
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc MiddleWare to ask the service the uppload for this uploadName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} filename - upload filename
 */
exports.uploadByName = async (req, res, next, uploadName) => {
  try {
    const upload = await UploadsService.get(uploadName);
    if (!upload) responses.error(res, 404, 'Not Found', 'No Upload with that name has been found')();
    else {
      req.upload = upload;
      req.isOwner = upload.metadata.user; // used if we proteck road by isOwner policy
      next();
    }
  } catch (err) {
    next(err);
  }
};
