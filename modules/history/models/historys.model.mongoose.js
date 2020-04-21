/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Data Model Mongoose
 */
const HistoryMongoose = new Schema({
  status: Boolean,
  data: String,
  time: Number,
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  api: {
    type: Schema.ObjectId,
    ref: 'Api',
  },
}, {
  timestamps: true,
});

/**
 * @desc Function to add id (+ _id) to all objects
 * @param {Object} history
 * @return {Object} History
 */
function addID() {
  return this._id.toHexString();
}

/**
 * Model configuration
 */
HistoryMongoose.virtual('id').get(addID);
// Ensure virtual fields are serialised.
HistoryMongoose.set('toJSON', {
  virtuals: true,
});

mongoose.model('History', HistoryMongoose);
