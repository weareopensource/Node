/**
 * Module dependencies
 */
const passport = require('passport');
const path = require('path');

const model = require(path.resolve('./lib/middlewares/model'));
const policy = require(path.resolve('./lib/middlewares/policy'));
const subscriptions = require('../controllers/subscriptions.controller');
const subscriptionsSchema = require('../models/subscriptions.schema');

/**
 * Routes
 */
module.exports = (app) => {
  // list & post
  app
    .route('/api/subscriptions')
    .get(passport.authenticate('jwt'), policy.isAllowed, subscriptions.list) // list
    .post(
      policy.isAllowed,
      model.isValid(subscriptionsSchema.Subscription),
      subscriptions.create,
    ); // create

  // classic crud
  app
    .route('/api/subscriptions/:subscriptionId')
    .all(policy.isAllowed) // policy.isOwner available (require set in middleWare)
    .get(subscriptions.get) // get
    .put(model.isValid(subscriptionsSchema.Subscription), subscriptions.update) // update
    .delete(
      model.isValid(subscriptionsSchema.Subscription),
      subscriptions.delete,
    ); // delete

  // Finish by binding the subscription middleware
  app.param('subscriptionId', subscriptions.subscriptionByID);
};
