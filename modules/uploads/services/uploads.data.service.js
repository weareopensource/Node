/**
 * Module dependencies
 */
import UploadRepository from '../repositories/uploads.repository.js';

/**
 * @desc Function to ask repository to get all uploads from a specific user
 * @param {Object} user
 * @return {Promise} user uploads
 */
const list = async (user) => {
  const result = await UploadRepository.list({ 'metadata.user': user._id });
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to remove all uploads from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
const remove = async (user) => {
  const result = await UploadRepository.deleteMany({ 'metadata.user': user._id });
  return Promise.resolve(result);
};

export default {
  list,
  remove,
};
