/**
 * Module dependencies
 */
const joiZxcvbn = require('joi-zxcvbn');
const PlainJoi = require('joi');

const Joi = PlainJoi.extend(joiZxcvbn(PlainJoi));

/**
 *  Data Schema
 */
const ApiSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  url: Joi.string().trim().required(),
  auth: Joi.string().valid(['lou']).required(),
  serviceId: Joi.string().trim().default('').required(),
  status: Joi.boolean().default(false).optional(),
  banner: Joi.string().trim().default('').allow('')
    .optional(),
  description: Joi.string().allow('').default('').optional(),
  user: Joi.string().trim().default(''),
});

module.exports = {
  Api: ApiSchema,
};
