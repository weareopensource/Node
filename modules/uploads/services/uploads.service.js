/**
 * Module dependencies
 */
const path = require('path');

const multer = require(path.resolve('./lib/services/multer'));
const UploadRepository = require('../repositories/uploads.repository');

/**
 * @desc Function to ask repository to get an upload
 * @param {String} id
 * @return {Stream} upload
 */
exports.get = async (uploadName) => {
  const result = await UploadRepository.get(uploadName);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get stream of chunks data
 * @param {String} id
 * @return {Stream} upload
 */
exports.getStream = async (upload) => {
  const result = await UploadRepository.getStream(upload);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get an upload
 * @param {String} id
 * @return {Stream} upload
 */
exports.update = async (file, user) => {
  const update = {
    filename: await multer.generateFileName(file.filename || file.originalname),
    metadata: {
      user: user.id,
    },
  };
  const result = await UploadRepository.update(file._id, update);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete chunks data
 * @param {String} id
 * @return {Promise} confirmation of delete
 */
exports.delete = async (upload) => {
  const result = await UploadRepository.delete(upload);
  return Promise.resolve(result);
};
