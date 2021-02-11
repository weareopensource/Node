/**
 * Module dependencies
 */
const UploadRepository = require('../repositories/uploads.repository');

/**
 * @desc Function to ask repository to get all uploads from a specific user
 * @param {Object} user
 * @return {Promise} user uploads
 */
exports.list = async (user) => {
  const result = await UploadRepository.list({ 'metadata.user': user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete all uploads from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
exports.delete = async (user) => {
  const result = await UploadRepository.deleteMany({ 'metadata.user': user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to import a list of uploads
 * @param {[Object]} uploads
 * @param {[String]} filters
 * @return {Promise} uploads
 */
exports.import = (uploads, filters, collection) => {
  const result = UploadRepository.import(uploads, filters, collection);
  return result;
};
