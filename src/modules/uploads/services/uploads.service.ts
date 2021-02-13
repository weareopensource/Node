/**
 * Module dependencies
 */
import { generateFileName } from '../../../lib/services/multer';
import * as UploadRepository from '../repositories/uploads.repository';
/**
 * @desc Function to ask repository to get an upload
 * @param {String} uploadName
 * @return {Promise} Upload
 */
export async function get(uploadName): Promise<any> {
  const result = await UploadRepository.get(uploadName);
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to get stream of chunks data
 * @param {Object} Upload
 * @return {Promise} result stream
 */
export async function getStream(upload) {
  const result = await UploadRepository.getStream(upload);
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to update an upload
 * @param {Object} req.file
 * @param {Object} User
 * @param {String} kind, upload configuration path (important for futur transformations)
 * @return {Promise} Upload
 */
export async function update(file, user, kind): Promise<any> {
  const upload = {
    filename: await generateFileName(file.filename || file.originalname),
    metadata: {
      user: user.id,
      kind: kind || null,
    },
  };
  const result = await UploadRepository.update(file._id, upload);
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to delete chunks data
 * @param {Object} Upload
 * @return {Promise} confirmation of delete
 */
export async function deleteUpload(upload) {
  const result = await UploadRepository.deleteUpload(upload);
  return Promise.resolve(result);
}
