/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Data Model Mongoose
 */
const TaskMongoose = new Schema(
  {
    title: String,
    description: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @desc Function to add id (+ _id) to all objects
 * @param {Object} task
 * @return {Object} Task
 */
function addID() {
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
