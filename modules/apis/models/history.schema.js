/**
 * Module dependencies
 */
const Joi = require('joi');

/**
 *  Data Schema
 */
const historySchema = Joi.object().keys({
  apiId: Joi.string().trim().required(),
  result: Joi.object({}).unknown().optional(),
  time: Joi.number().default(0).required(),
  status: Joi.boolean().default(false).required(),
});

module.exports = {
  Scrap: historySchema,
};
