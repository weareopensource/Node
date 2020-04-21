/**
 * Module dependencies
 */
const Joi = require('joi');

/**
 *  Data Schema
 */
const HistorySchema = Joi.object().keys({
  status: Joi.boolean().default(false).required(),
  data: Joi.string().optional(),
  time: Joi.number().default(0).required(),
  user: Joi.string().trim().default(''),
  api: Joi.string().trim().default(''),
});

module.exports = {
  History: HistorySchema,
};
