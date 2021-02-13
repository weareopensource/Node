/**
 * Module dependencies
 */
import mongoose from 'mongoose';
import { createModel } from 'mongoose-gridfs';
import AppError from '../../../lib/helpers/AppError';
import Uploads from '../models/uploads.model.mongoose';

const Attachment = createModel({ bucketName: 'uploads', model: 'Uploads' });

/**
 * @desc Function to get all upload in db with filter or not
 * @param {Object} Filter
 * @return {Array} uploads
 */
export function list(filter) {
  return Uploads.find(filter)
    .select('filename uploadDate contentType')
    .sort('-createdAt')
    .exec();
}

/**
 * @desc Function to get an upload from db
 * @param {String} uploadName
 * @return {Stream} upload
 */
export function get(uploadName) {
  return Uploads.findOne({ filename: uploadName })
    .exec();
}

/**
 * @desc Function to get an upload stream from db
 * @param {Object} Upload
 * @return {Stream} upload
 */
export function getStream(upload) {
  return Attachment.read(upload);
}

/**
 * @desc Function to update an upload in db
 * @param {ObjectID} upload ID
 * @param {Object} upload
 * @return {Object} upload updated
 */
export function update(id, upload) {
  return Uploads.findOneAndUpdate({ _id: id }, upload, { new: true })
    .exec();
}

/**
 * @desc Function to delete an upload from db
 * @param {Object} upload
 * @return {Object} confirmation of delete
 */
export async function deleteUpload(upload) {
  if (!upload._id) upload = await Uploads.findOne({ filename: upload.filename }).exec();
  if (upload) {
    Attachment.unlink(upload._id, (err, unlinked) => {
      if (err) throw new AppError('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
      return unlinked;
    });
  }
}

/**
 * @desc Function to delete uploads of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
export async function deleteMany(filter) {
  const uploads = await list(filter);
  uploads.forEach((upload) => {
    Attachment.unlink(upload._id, (err, unlinked) => {
      if (err) throw new AppError('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
      return unlinked;
    });
  });
  return { deletedCount: uploads.length };
}

/**
 * @desc Function to purge uploads by kind if they are not referenced in another collection
 * @param {String} kind - metadata kind to match
 * @param {collection} collection - name of the collection to check reference presence
 * @param {String} key - name of the key to check id
 * @return {Object} confirmation of delete
 */
export async function purge(kind, collection, key) {
  const toDelete = await Uploads.aggregate([
    { $match: { 'metadata.kind': kind } },
    {
      $lookup: {
        from: collection,
        localField: 'filename',
        foreignField: key,
        as: 'references',
      },
    },
    { $match: { references: [] } },
  ]);
  toDelete.forEach(async (id) => {
    Attachment.unlink(id, (err, unlinked) => {
      if (err) throw new AppError('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
      return unlinked;
    });
  });
  return { deletedCount: toDelete.length };
}

/**
 * @desc Function to import list of uploads in db
 */
export function importUpload(uploads, filters, collection) {
  const schema = new mongoose.Schema({}, { collection, strict: false });
  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, schema);
  }
  return model.bulkWrite(uploads.map((upload) => {
    const filter = {};
    filters.forEach((value) => {
      filter[value] = upload[value];
    });
    return {
      updateOne: {
        filter,
        update: upload,
        upsert: true,
      },
    };
  }));
}
