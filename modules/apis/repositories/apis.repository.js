/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Api = mongoose.model('Api');

const defaultPopulate = [{
  path: 'history',
  options: {
    limit: 100,
    sort: { createdAt: -1 },
  },
}];

/**
 * @desc Function to get all api in db
 * @return {Array} All apis
 */
exports.list = (user) => Api.find({ user: user._id }).select('-history').sort('-createdAt').exec();

/**
 * @desc Function to get all scrap to cron in db
 * @return {Array} All scraps
 */
exports.cron = () => Api.find({ cron: { $ne: null, $exists: true } }).populate('containers')
  .exec();

/**
 * @desc Function to create a api in db
 * @param {Object} api
 * @return {Object} api
 */
exports.create = (api) => new Api(api).save();

/**
 * @desc Function to get a api from db
 * @param {String} id
 * @return {Object} api
 */
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Api.findOne({ _id: id }).populate(defaultPopulate).exec();
};

/**
 * @desc Function to update a api in db
 * @param {Object} api
 * @return {Object} api
 */
exports.update = (api) => new Api(api).save().then((a) => a.populate(defaultPopulate).execPopulate());

/**
 * @desc Function to delete a api in db
 * @param {Object} api
 * @return {Object} confirmation of delete
 */
exports.delete = (api) => Api.deleteOne({ _id: api.id }).exec();

/**
 * @desc Function to update scrap history in db
 * @param {Object} scrap
 * @param {Object} history
 * @return {Object} scrap
 */
exports.historize = (api, history) => Api.updateOne(
  { _id: api._id },
  {
    $push: { history: history._id },
    $set: { status: history.status },
  },
);

/**
 * @desc Function to import list of locations in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.import = (collection, items) => {
  const _schema = new mongoose.Schema({}, { collection, strict: false });
  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }
  return model.bulkWrite(items.map((item) => ({
    updateOne: {
      filter: item.filter,
      update: item.update,
      arrayFilters: item.arrayFilters ? item.arrayFilters : [],
      upsert: item.upsert ? item.upsert : false,
    },
  })));
};

/**
 * @desc Function to get api data from db
 * @param {string} colletion name
 * @return [{Object}] data
 */
exports.listApi = (collection) => {
  const _schema = new mongoose.Schema({}, { collection, strict: false, timestamps: true });
  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }
  return model.find().sort('-updatedAt').limit(100).exec();
};

/**
 * @desc Function to ask for api data in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.getApi = (collection, filters) => {
  const _schema = new mongoose.Schema({}, { collection, strict: false, timestamps: true });
  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }
  return model.findOne(filters).exec();
};

/**
 * @desc Function to make aggregate on api data in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.getAggregateApi = (collection, request) => {
  const _schema = new mongoose.Schema({}, { collection, strict: false, timestamps: true });
  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }
  return model.aggregate(request).exec();
};
