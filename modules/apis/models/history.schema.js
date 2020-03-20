/**
 * Module dependencies
 */
const Joi = require('joi');

/**
 *  Data Schema
 */
const historySchema = Joi.object().keys({
  status: Joi.boolean().default(false).required(),
  err: Joi.object({}).unknown().optional(),
  time: Joi.number().default(0).required(),
});

module.exports = {
  Scrap: historySchema,
};
