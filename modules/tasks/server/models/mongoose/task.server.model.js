/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Task Schema
 */
const TaskSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title can not be blank'
  },
  description: {
    type: String,
    default: '',
    required: 'Description cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Task', TaskSchema);
