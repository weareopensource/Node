/**
 * Module dependencies
 */
const path = require('path');

const errors = require(path.resolve('./lib/helpers/errors'));
const responses = require(path.resolve('./lib/helpers/responses'));

const SubscriptionsService = require('../services/subscriptions.service');

/**
 * @desc Endpoint to ask the service to get the list of subscriptions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.list = async (req, res) => {
  try {
    const subscriptions = await SubscriptionsService.list();
    responses.success(res, 'subscription list')(subscriptions);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to create a subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.create = async (req, res) => {
  try {
    const subscription = await SubscriptionsService.create(req.body);
    responses.success(res, 'subscription created')(subscription);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to show the current subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.get = (req, res) => {
  const subscription = req.subscription ? req.subscription.toJSON() : {};
  responses.success(res, 'subscription get')(subscription);
};

/**
 * @desc Endpoint to ask the service to update a subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = async (req, res) => {
  try {
    const subscription = await SubscriptionsService.update(req.subscription, req.body);
    responses.success(res, 'subscription updated')(subscription);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc Endpoint to ask the service to delete a subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  try {
    const result = await SubscriptionsService.delete(req.subscription);
    result.id = req.subscription.id;
    responses.success(res, 'subscription deleted')(result);
  } catch (err) {
    responses.error(res, 422, 'Unprocessable Entity', errors.getMessage(err))(err);
  }
};

/**
 * @desc MiddleWare to ask the service the subscription for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - subscription id
 */
exports.subscriptionByID = async (req, res, next, id) => {
  try {
    const subscription = await SubscriptionsService.get(id);
    if (!subscription) responses.error(res, 404, 'Not Found', 'No Subscription with that identifier has been found')();
    else {
      req.subscription = subscription;
      // if (subscription.user) req.isOwner = subscription.user._id; // user id used if we proteck road by isOwner policy
      next();
    }
  } catch (err) {
    next(err);
  }
};
