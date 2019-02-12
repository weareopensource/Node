/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Data Model Mongoose
 */
const TaskMongoose = new Schema({
  title: String,
  description: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
});

// add virtual id field (FIXME mongoose.virtual ko es6)
function addID() {
  return this._id.toHexString();
}
TaskMongoose.virtual('id').get(addID);

// Ensure virtual fields are serialised.
TaskMongoose.set('toJSON', {
  virtuals: true,
});

mongoose.model('Task', TaskMongoose);
