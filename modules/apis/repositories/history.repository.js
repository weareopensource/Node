/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const History = mongoose.model('History');

/**
 * @desc Function to create a scrap in db
 * @param {Object} scrap
 * @return {Object} scrap
 */
exports.create = (history) => new History(history).save();
