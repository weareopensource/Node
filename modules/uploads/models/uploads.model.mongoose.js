/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Data Model Mongoose
 */
const UploadsMongoose = new Schema(
  {
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    md5: String,
    filename: String,
    contentType: String,
    metadata: {
      user: {
        type: Schema.ObjectId,
        ref: 'User',
      },
      kind: String,
    },
  },
  { strict: false },
);

mongoose.model('Uploads', UploadsMongoose, 'uploads.files');
