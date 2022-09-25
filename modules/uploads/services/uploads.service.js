/**
 * Module dependencies
 */
import multerService from '../../../lib/services/multer.js';
import UploadRepository from '../repositories/uploads.repository.js';

/**
 * @desc Function to ask repository to get an upload
 * @param {String} uploadName
 * @return {Promise} Upload
 */
const get = async (uploadName) => {
  const result = await UploadRepository.get(uploadName);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get stream of chunks data
 * @param {Object} Upload
 * @return {Promise} result stream
 */
const getStream = async (upload) => {
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
const update = async (file, user, kind) => {
  const update = {
    filename: await multerService.generateFileName(file.filename || file.originalname),
    metadata: {
      user: user.id,
      kind: kind || null,
    },
  };
  const result = await UploadRepository.update(file._id, update);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to remove chunks data
 * @param {Object} Upload
 * @return {Promise} confirmation of delete
 */
const remove = async (upload) => {
  const result = await UploadRepository.remove(upload);
  return Promise.resolve(result);
};

export default {
  get,
  getStream,
  update,
  remove,
};
