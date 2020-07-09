/**
 * Module dependencies
 */
const Joi = require('@hapi/joi');

/**
 *  Data Schema
 */
const SubscriptionSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  news: Joi.boolean().default(true).required(),
});

module.exports = {
  Subscription: SubscriptionSchema,
};
