/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Task Schema
 */
const TaskMongoose = new Schema({
  title: String,
  description: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
});

mongoose.model('Task', TaskMongoose);
