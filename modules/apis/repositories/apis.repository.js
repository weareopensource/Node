/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Api = mongoose.model('Api');

/**
 * @desc Function to get all api in db
 * @return {Array} All apis
 */
exports.list = () => Api.find().sort('-createdAt').exec();

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
  return Api.findOne({ _id: id }).populate('history').exec();
};

/**
 * @desc Function to update a api in db
 * @param {Object} api
 * @return {Object} api
 */
exports.update = (api) => new Api(api).save().then((a) => a.populate('history').execPopulate());

/**
 * @desc Function to delete a api in db
 * @param {Object} api
 * @return {Object} confirmation of delete
 */
exports.delete = (api) => Api.deleteOne({ _id: api.id }).exec();

/**
 * @desc Function to import list of locations in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.import = (collection, items) => {
  const _schema = new mongoose.Schema({}, {
    collection,
    strict: false,
    timestamps: true,
  });

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
      upsert: item.upsert,
    },
  })));
};


/**
 * @desc Function to import list of locations in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.getApiData = (collection) => {
  const _schema = new mongoose.Schema({}, {
    collection,
    strict: false,
    timestamps: true,
  });

  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }

  return model.find().sort('-createdAt').exec();
};
