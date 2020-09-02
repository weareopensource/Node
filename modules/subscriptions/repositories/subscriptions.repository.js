/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Subscription = mongoose.model('Subscription');

/**
 * @desc Function to get all subscription in db with filter or not
 * @return {Array} subscriptions
 */
exports.list = (filter) => Subscription.find(filter).sort('-createdAt').exec();

/**
 * @desc Function to create a subscription in db
 * @param {Object} subscription
 * @return {Object} subscription
 */
exports.create = (subscription) => new Subscription(subscription).save();

/**
 * @desc Function to get a subscription from db
 * @param {String} id
 * @return {Object} subscription
 */
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Subscription.findOne({ _id: id }).exec();
};

/**
 * @desc Function to update a subscription in db
 * @param {Object} subscription
 * @return {Object} subscription
 */
exports.update = (subscription) => new Subscription(subscription).save();

/**
 * @desc Function to delete a subscription in db
 * @param {Object} subscription
 * @return {Object} confirmation of delete
 */
exports.delete = (subscription) =>
  Subscription.deleteOne({ _id: subscription.id }).exec();

/**
 * @desc Function to delete subscriptions of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
exports.deleteMany = (filter) => {
  if (filter) return Subscription.deleteMany(filter).exec();
};

/**
 * @desc Function to import list of subscriptions in db
 * @param {[Object]} subscriptions
 * @param {[String]} filters
 * @return {Object} subscriptions
 */
exports.import = (subscriptions, filters) =>
  Subscription.bulkWrite(
    subscriptions.map((subscription) => {
      const filter = {};
      filters.forEach((value) => {
        filter[value] = subscription[value];
      });
      return {
        updateOne: {
          filter,
          update: subscription,
          upsert: true,
        },
      };
    }),
  );
