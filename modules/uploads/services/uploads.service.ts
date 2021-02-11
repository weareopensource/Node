/**
 * Module dependencies
 */
const path = require('path');

const multer = require(path.resolve('./lib/services/multer'));
const UploadRepository = require('../repositories/uploads.repository');

/**
 * @desc Function to ask repository to get an upload
 * @param {String} uploadName
 * @return {Promise} Upload
 */
exports.get = async (uploadName) => {
  const result = await UploadRepository.get(uploadName);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get stream of chunks data
 * @param {Object} Upload
 * @return {Promise} result stream
 */
exports.getStream = async (upload) => {
  const result = await UploadRepository.getStream(upload);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to update an upload
 * @param {Object} req.file
 * @param {Object} User
 * @param {String} kind, upload configuration path (important for futur transformations)
 * @return {Promise} Upload
 */
exports.update = async (file, user, kind) => {
  const update = {
    filename: await multer.generateFileName(file.filename || file.originalname),
    metadata: {
      user: user.id,
      kind: kind || null,
    },
  };
  const result = await UploadRepository.update(file._id, update);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete chunks data
 * @param {Object} Upload
 * @return {Promise} confirmation of delete
 */
exports.delete = async (upload) => {
  const result = await UploadRepository.delete(upload);
  return Promise.resolve(result);
};
