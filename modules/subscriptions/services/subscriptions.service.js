/**
 * Module dependencies
 */
const SubscriptionsRepository = require('../repositories/subscriptions.repository');

/**
 * @desc Function to get all subscription in db
 * @return {Promise} All subscriptions
 */
exports.list = async () => {
  const result = await SubscriptionsRepository.list();
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to create a subscription
 * @param {Object} subscription
 * @return {Promise} subscription
 */
exports.create = async (subscription) => {
  const result = await SubscriptionsRepository.create(subscription);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to get a subscription
 * @param {String} id
 * @return {Promise} subscription
 */
exports.get = async (id) => {
  const result = await SubscriptionsRepository.get(id);
  return Promise.resolve(result);
};

/**
 * @desc Functio to ask repository to update a subscription
 * @param {Object} subscription - original subscription
 * @param {Object} body - subscription edited
 * @return {Promise} subscription
 */
exports.update = async (subscription, body) => {
  subscription.email = body.email;
  const result = await SubscriptionsRepository.update(subscription);
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to delete a subscription
 * @param {Object} subscription
 * @return {Promise} confirmation of delete
 */
exports.delete = async (subscription) => {
  const result = await SubscriptionsRepository.delete(subscription);
  return Promise.resolve(result);
};
