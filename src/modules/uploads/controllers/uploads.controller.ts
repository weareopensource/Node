/**
 * Module dependencies
 */
import sharp from 'sharp';
import _ from 'lodash';
import { Response } from 'express';

import getMessage from '../../../lib/helpers/errors';
import { NodeRequest, success, error } from '../../../lib/helpers/responses';
import * as UploadsService from '../services/uploads.service';
import config from '../../../config';

/**
 * @desc Endpoint to get an upload by fileName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function get(req: NodeRequest, res: Response) {
  try {
    const stream = await UploadsService.getStream({ _id: req.upload._id });
    if (!stream) error(res, 404, 'Not Found', 'No Upload with that identifier can been found')();
    stream.on('error', (err) => {
      error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
    });
    res.set('Content-Type', req.upload.contentType);
    res.set('Content-Length', req.upload.length);
    stream.pipe(res);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to get an upload by fileName with sharp options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getSharp(req: NodeRequest, res: Response) {
  try {
    const stream = await UploadsService.getStream({ _id: req.upload._id });
    if (!stream) error(res, 404, 'Not Found', 'No Upload with that identifier can been found')();
    stream.on('error', (err) => {
      error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
    });
    res.set('Content-Type', req.upload.contentType);
    switch (req.sharpOption) {
      case 'blur':
        stream.pipe(sharp().resize(req.sharpSize).blur(config.uploads.sharp.blur)).pipe(res);
        break;
      case 'bw':
        stream.pipe(sharp().resize(req.sharpSize).grayscale()).pipe(res);
        break;
      case 'blur&bw':
        stream.pipe(sharp().resize(req.sharpSize).grayscale().blur(config.uploads.sharp.blur)).pipe(res);
        break;
      default:
        stream.pipe(sharp().resize(req.sharpSize)).pipe(res);
    }
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to delete an upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteUpload(req: NodeRequest, res: Response) {
  try {
    await UploadsService.deleteUpload({ _id: req.upload._id });
    success(res, 'upload deleted')();
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc MiddleWare to ask the service the uppload for this uploadName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} filename - upload filename
 */
export async function uploadByName(req, res, next, uploadName) {
  try {
    const upload = await UploadsService.get(uploadName);
    if (!upload) error(res, 404, 'Not Found', 'No Upload with that name has been found')();
    else {
      req.upload = upload;
      if (upload.metadata && upload.metadata.user) req.isOwner = upload.metadata.user; // user id if we proteck road by isOwner policy
      next();
    }
  } catch (err) {
    next(err);
  }
}

/**
 * @desc MiddleWare to ask the service the uppload for this uploadImageName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} filename & params - upload filename & eventual params (two max) filename-maxSize-options.png
 */
export async function uploadByImageName(req, res, next, uploadImageName) {
  try {
    // Name
    const imageName = uploadImageName.split('.');
    const opts = imageName[0].split('-');
    if (imageName.length !== 2) return error(res, 404, 'Not Found', 'Wrong name schema')();
    if (opts.length > 3) return error(res, 404, 'Not Found', 'Too much params')();

    // data work
    const upload = await UploadsService.get(`${opts[0]}.${imageName[1]}`);
    if (!upload) return error(res, 404, 'Not Found', 'No Upload with that name has been found')();

    // options
    const sharpConfig = _.get(config, `uploads.${upload.metadata.kind}.sharp`);
    if (opts[1] && (!sharpConfig || !sharpConfig.sizes)) return error(res, 422, 'Unprocessable Entity', 'Size param not available')();
    if (opts[1] && (!/^\d+$/.test(opts[1]) || !sharpConfig.sizes.includes(opts[1]))) return error(res, 422, 'Unprocessable Entity', 'Wrong size param')();
    if (opts[2] && (!sharpConfig || !sharpConfig.operations)) return error(res, 422, 'Unprocessable Entity', 'Operations param not available')();
    if (opts[2] && !sharpConfig.operations.includes(opts[2])) return error(res, 422, 'Unprocessable Entity', 'Operation param not available')();

    // return
    req.upload = upload;
    if (upload.metadata && upload.metadata.user) req.isOwner = upload.metadata.user; // user id if we proteck road by isOwner policy
    req.sharpSize = parseInt(opts[1], 10) || null;
    req.sharpOption = opts[2] || null;
    next();
  } catch (err) {
    next(err);
  }
}
