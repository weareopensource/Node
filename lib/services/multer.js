/**
 * Module dependencies.
 */
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');
const multer = require('multer');
const { createBucket } = require('mongoose-gridfs');

const AppError = require(path.resolve('./lib/helpers/AppError'));

let storage;

/**
 * @desc File filter
 * @param {Array} formats - array of accepted mimetype string
 * @return {callback}
 */
const fileFilter = (formats) => (req, file, callback) => {
  if (formats.includes(file.mimetype)) callback(null, true);
  else callback(new AppError(`Only ${formats} images allowed`, { code: 'SERVICE_ERROR' }), false);
};

/**
 * set Strorage
 */
module.exports.storage = () => {
  storage = createBucket({
    bucketName: 'uploads',
    model: 'Uploads',
  });
};

/**
 * @desc file upload middleware
 * @param {String} name - key data name in form-data
 * @param {Object} config - multer config
 * @return {callback}
 */
module.exports.create = (name, config) => async (req, res, next) => {
  // set options
  const options = _.cloneDeep(config) || {};
  if (options.formats) {
    options.fileFilter = fileFilter(options.formats);
    delete options.formats;
  }
  // set storage
  options.storage = storage;
  // upload
  const upload = multer(options).single(name);
  upload(req, res, (err) => {
    if (err) {
      req.multerErr = err;
      next();
    } else {
      next();
    }
  });
};

/**
 * @desc Generate file name
 * @param {String} filename - original filename
 * @return {resolve}
 */
module.exports.generateFileName = (filename) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) reject(new AppError('Error generateFileName', { code: 'SERVICE_ERROR' }));
      resolve(buf.toString('hex') + path.extname(filename));
    });
  });
