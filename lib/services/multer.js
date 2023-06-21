/**
 * Module dependencies.
 */
import _ from 'lodash';
import multer from 'multer';
import mongooseService from './mongoose.js';
import AppError from '../helpers/AppError.js';

/**
 * @desc File filter
 * @param {Array} formats - array of accepted mimetype string
 * @return {callback}
 */
const fileFilter = (formats, size) => (req, file, cb) => {
  const fileSize = parseInt(req.headers['content-length']);
  if (!formats.includes(file.mimetype)) cb(new AppError(`Only ${formats} files allowed`, { code: 'SERVICE_ERROR' }), false);
  if (fileSize > size) cb(new AppError(`Only files lower than ${size / (1024 * 1024)}mo are allowed`, { code: 'SERVICE_ERROR' }), false);
  cb(null, true);
};

/**
 * @desc file upload middleware
 * @param {String} name - key data name in form-data
 * @param {Object} config - multer config
 * @return {callback}
 */
const create = (name, config) => async (req, res, next) => {
  // condif
  const options = _.cloneDeep(config) || {};
  if (options.formats) {
    options.fileFilter = fileFilter(options.formats, options.limits.fileSize);
    delete options.formats;
  }
  options.storage = mongooseService.getStorage();
  // kind
  config.kind ? (req.kind = config.kind) : (req.kind = name);
  // upload
  const upload = multer(options).single(name);
  upload(req, res, (err) => {
    if (err) {
      req.multerErr = err;
    }
    next();
  });
};

export default {
  create,
};
