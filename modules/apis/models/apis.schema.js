/**
 * Module dependencies
 */
const Joi = require('joi');

/**
 *  Data Schema
 */
const ApiSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  slug: Joi.string().trim().optional(),
  url: Joi.string().trim().required(),
  auth: Joi.string().valid(['lou']).required(),
  serviceKey: Joi.string().trim().default('').required(),
  path: Joi.string().trim().default('').required(),
  params: Joi.object({}).unknown().optional(),
  typing: Joi.string().trim().allow('').optional(),
  mapping: Joi.string().trim().allow('').optional(),
  status: Joi.boolean().default(false).optional(),
  banner: Joi.string().trim().default('').allow('')
    .optional(),
  description: Joi.string().allow('').default('').optional(),
  savedb: Joi.boolean().default(false).required(),
  autoRequest: Joi.boolean().default(false).required(),
  expiration: Joi.date().optional(),
  cron: Joi.string().trim().allow(null).optional(),
  alert: Joi.string().email({ minDomainAtoms: 2 }).trim().allow(null)
    .optional(),
  user: Joi.string().trim().default(''),
  history: Joi.array().items(Joi.string().trim()).optional(),
});

module.exports = {
  Api: ApiSchema,
};
