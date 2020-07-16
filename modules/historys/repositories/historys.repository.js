/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const History = mongoose.model('History');

const defaultPopulate = [{
  path: 'api',
  select: 'id title',
}];

/**
 * @desc Function to get all history in db
 * @return {Array} All historys
 */
exports.list = (user) => History.find({ user: user._id }).sort('-createdAt').populate(defaultPopulate).limit(500)
  .exec();

/**
 * @desc Function to create a scrap in db
 * @param {Object} scrap
 * @return {Object} scrap
 */
exports.create = (history) => new History(history).save();

/**
 * @desc Function to get a history from db
 * @param {String} id
 * @return {Object} history
 */
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return History.findOne({ _id: id }).exec();
};

/**
 * @desc Function to get collection stats
 * @return {Object} scrap
 */
exports.stats = () => History.countDocuments();
