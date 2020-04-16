/**
 * Module dependencies
 */
const joiZxcvbn = require('joi-zxcvbn');
const PlainJoi = require('joi');
const historySchema = require('./history.schema');

const Joi = PlainJoi.extend(joiZxcvbn(PlainJoi));

/**
 *  Data Schema
 */
const ApiSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  slug: Joi.string().trim().optional(),
  url: Joi.string().trim().required(),
  auth: Joi.string().valid(['lou']).required(),
  serviceKey: Joi.string().trim().default('').required(),
  params: Joi.object({}).unknown().optional(),
  typing: Joi.string().trim().allow('').optional(),
  mapping: Joi.string().trim().allow('').optional(),
  status: Joi.boolean().default(false).optional(),
  banner: Joi.string().trim().default('').allow('')
    .optional(),
  description: Joi.string().allow('').default('').optional(),
  user: Joi.string().trim().default(''),
  history: Joi.array().items(historySchema).optional(),
  savedb: Joi.boolean().default(false).optional(),
});

module.exports = {
  Api: ApiSchema,
};
