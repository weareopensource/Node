/**
 * Module dependencies
 */
import mongoose from 'mongoose';

/**
 * Data Model Mongoose
 */
const TaskMongoose = new mongoose.Schema({
  title: String,
  description: String,
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * @desc Function to add id (+ _id) to all objects
 * @return {Object} Task
 */
function addID(this: any) {
  return this._id.toHexString();
}

/**
 * Model configuration
 */
TaskMongoose.virtual('id').get(addID);
// Ensure virtual fields are serialised.
TaskMongoose.set('toJSON', {
  virtuals: true,
});

mongoose.model('Task', TaskMongoose);
