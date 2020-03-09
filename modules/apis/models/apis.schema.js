/**
 * Module dependencies
 */
const joiZxcvbn = require('joi-zxcvbn');
const PlainJoi = require('joi');
const path = require('path');

const Joi = PlainJoi.extend(joiZxcvbn(PlainJoi));
const config = require(path.resolve('./config'));

/**
 *  Data Schema
 */
const ApiSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  url: Joi.string().trim().required(),
  auth: Joi.string().valid(['jwt']).optional(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  password: Joi.string().min(4).max(128).default('')
    .zxcvbn(config.zxcvbn.minimumScore),
  status: Joi.boolean().default(false).optional(),
  banner: Joi.string().trim().default('').allow('')
    .optional(),
  description: Joi.string().allow('').default('').optional(),
  user: Joi.string().trim().default(''),
});

module.exports = {
  Api: ApiSchema,
};
