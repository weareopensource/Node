/**
 * Module dependencies
 */
const Joi = require('@hapi/joi');

/**
 *  Data Schema
 */
const HistorySchema = Joi.object().keys({
  status: Joi.boolean().default(false).required(),
  data: Joi.string().optional(),
  time: Joi.number().default(0).required(),
  user: Joi.string().trim().default('').optional(),
  username: Joi.string().trim().required(),
  api: Joi.string().trim().default(''),
});

module.exports = {
  History: HistorySchema,
};
