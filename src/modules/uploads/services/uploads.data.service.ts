/**
 * Module dependencies
 */
import * as UploadRepository from '../repositories/uploads.repository';

/**
 * @desc Function to ask repository to get all uploads from a specific user
 * @param {Object} user
 * @return {Promise} user uploads
 */
export async function list(user) {
  const result = await UploadRepository.list({ 'metadata.user': user._id });
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to delete all uploads from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
export async function deleteMany(user) {
  const result = await UploadRepository.deleteMany({ 'metadata.user': user._id });
  return Promise.resolve(result);
}

/**
 * @desc Function to ask repository to import a list of uploads
 */
export function importUpload(uploads, filters, collection) {
  return UploadRepository.importUpload(uploads, filters, collection);
}
