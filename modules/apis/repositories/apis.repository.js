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
  return Api.findOne({ _id: id }).exec();
};

/**
 * @desc Function to update a api in db
 * @param {Object} api
 * @return {Object} api
 */
exports.update = (api) => new Api(api).save();

/**
 * @desc Function to delete a api in db
 * @param {Object} api
 * @return {Object} confirmation of delete
 */
exports.delete = (api) => Api.deleteOne({ _id: api.id }).exec();
