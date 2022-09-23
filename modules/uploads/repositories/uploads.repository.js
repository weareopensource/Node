/**
 * Module dependencies
 */
import mongoose from 'mongoose';
import { createModel } from 'mongoose-gridfs';

import AppError from '../../../lib/helpers/AppError.js';

const Attachment = createModel({ bucketName: 'uploads', model: 'Uploads' });
const Uploads = mongoose.model('Uploads');

/**
 * @desc Function to get all upload in db with filter or not
 * @param {Object} Filter
 * @return {Array} uploads
 */
const list = (filter) => Uploads.find(filter).select('filename uploadDate contentType').sort('-createdAt').exec();

/**
 * @desc Function to get an upload from db
 * @param {String} uploadName
 * @return {Stream} upload
 */
const get = (uploadName) => Uploads.findOne({ filename: uploadName }).exec();

/**
 * @desc Function to get an upload stream from db
 * @param {Object} Upload
 * @return {Stream} upload
 */
const getStream = (upload) => Attachment.read(upload);

/**
 * @desc Function to update an upload in db
 * @param {ObjectID} upload ID
 * @param {Object} update
 * @return {Object} upload updated
 */
const update = (id, update) => Uploads.findOneAndUpdate({ _id: id }, update, { new: true }).exec();

/**
 * @desc Function to remove an upload from db
 * @param {Object} upload
 * @return {Object} confirmation of delete
 */
const remove = async (upload) => {
  if (!upload._id) upload = await Uploads.findOne({ filename: upload.filename }).exec();
  if (upload) {
    Attachment.unlink(upload._id, (err, unlinked) => {
      if (err) throw new AppError('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
      return unlinked;
    });
  }
};

/**
 * @desc Function to remove uploads of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
const deleteMany = async (filter) => {
  const uploads = await list(filter);
  uploads.forEach((upload) => {
    Attachment.unlink(upload._id, (err, unlinked) => {
      if (err) throw new AppError('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
      return unlinked;
    });
  });
  return { deletedCount: uploads.length };
};

/**
 * @desc Function to purge uploads by kind if they are not referenced in another collection
 * @param {String} kind - metadata kind to match
 * @param {collection} collection - name of the collection to check reference presence
 * @param {String} key - name of the key to check id
 * @return {Object} confirmation of delete
 */
const purge = async (kind, collection, key) => {
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
};

/**
 * @desc Function to push list of uploads in db
 * @param {[Object]} uploads
 * @param {[String]} filters
 * @return {Object} uploads
 */
const push = (uploads, filters, collection) => {
  const _schema = new mongoose.Schema({}, { collection, strict: false });
  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }
  return model.bulkWrite(
    uploads.map((upload) => {
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
    }),
  );
};

export default {
  list,
  get,
  getStream,
  update,
  remove,
  deleteMany,
  purge,
  push,
};
