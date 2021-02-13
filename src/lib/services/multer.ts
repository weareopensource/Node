/**
 * Module dependencies.
 */
import { Request } from 'express';
import path from 'path';
import _ from 'lodash';
import crypto from 'crypto';
import multer from 'multer';
import { createBucket } from 'mongoose-gridfs';
import AppError from '../helpers/AppError';

export let storageInfo;

/**
 * @desc File filter
 * @param {Array} formats - array of accepted mimetype string
 * @return {callback}
 */
const fileFilter = (formats) => (req: Request, file, callback) => {
  if (formats.includes(file.mimetype)) callback(null, true);
  else callback(new AppError(`Only ${formats} images allowed`, { code: 'SERVICE_ERROR' }), false);
};

/**
 * set Strorage
 */
export function storage() {
  storageInfo = createBucket({
    bucketName: 'uploads',
    model: 'Uploads',
  });
}

/**
 * @desc file upload middleware
 * @param {String} name - key data name in form-data
 * @param {Object} config - multer config
 * @return {callback}
 */
export function create(name, config) {
  return async (req, res, next) => {
    // set options
    const options = _.cloneDeep(config) || {};
    if (options.formats) {
      options.fileFilter = fileFilter(options.formats);
      delete options.formats;
    }
    // set storage
    options.storage = storage;
    // upload
    const upload = multer(options)
      .single(name);
    upload(req, res, (err) => {
      if (err) {
        req.multerErr = err;
        next();
      } else {
        next();
      }
    });
  };
}

export function generateFileName(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) reject(new AppError('Error generateFileName', { code: 'SERVICE_ERROR' }));
      resolve(buf.toString('hex') + path.extname(filename));
    });
  });
}
