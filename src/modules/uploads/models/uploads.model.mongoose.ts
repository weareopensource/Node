/**
 * Module dependencies
 */
import mongoose from 'mongoose';

interface IUpload extends mongoose.Document {
  length: number,
  chunkSize: number,
  uploadDate: number,
  md5: string,
  filename: string,
  contentType: string,
  metadata: {
    user: any,
    kind: string,
  },
}
/**
 * Data Model Mongoose
 */
const UploadsMongoose = new mongoose.Schema({
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  md5: String,
  filename: String,
  contentType: String,
  metadata: {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    kind: String,
  },
}, { strict: false });

export default mongoose.model<IUpload>('Uploads', UploadsMongoose, 'uploads.files');
