/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const History = mongoose.model('History');
const Api = mongoose.model('Api');


const defaultPopulate = [{
  path: 'api',
  select: 'id title',
}];

/**
 * @desc Function to get all history in db
 * @return {Array} All historys
 */
exports.list = (user) => History.find({ user: user._id }).sort('-createdAt').populate(defaultPopulate).limit(500)
  .exec;
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
 * @desc Function to update scrap history in db
 * @param {Object} scrap
 * @param {Object} history
 * @return {Object} scrap
 */
exports.apiHistorize = (api, history) => Api.updateOne(
  { _id: api._id },
  {
    $push: { history: history._id },
    $set: { status: history.status },
  },
);
