/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Data Model Mongoose
 */
const ApiMongoose = new Schema({
  title: String,
  url: String,
  auth: String,
  serviceId: String,
  params: {},
  typing: String,
  mapping: String,
  status: Boolean,
  banner: String,
  description: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  history: [{
    type: Schema.ObjectId,
    ref: 'History',
  }],
}, {
  timestamps: true,
});

/**
 * @desc Function to add id (+ _id) to all objects
 * @param {Object} api
 * @return {Object} Api
 */
function addID() {
  return this._id.toHexString();
}

/**
 * Model configuration
 */
ApiMongoose.virtual('id').get(addID);
// Ensure virtual fields are serialised.
ApiMongoose.set('toJSON', {
  virtuals: true,
});

mongoose.model('Api', ApiMongoose);
