/**
 * Module dependencies
 */
const PlainJoi = require('@hapi/joi');
const path = require('path');

const joiHelpers = require(path.resolve('./lib/helpers/joi'));
const Joi = PlainJoi.extend(joiHelpers.joiZxcvbn(PlainJoi));
const config = require(path.resolve('./config'));

/**
 * User Data Schema
 */
const UserSchema = Joi.object().keys({
  sub: Joi.string().trim().default(''),
  firstName: Joi.string().alphanum().min(1).max(30).trim().required(),
  lastName: Joi.string().alphanum().min(1).max(30).trim().required(),
  bio: Joi.string().max(200).trim().allow('').optional(),
  email: Joi.string().email(),
  avatar: Joi.string().trim().default(''),
  roles: Joi.array()
    .items(Joi.string().valid(...config.whitelists.users.roles))
    .min(1)
    .default(['user']),
  /* Extra */
  updated: Joi.date(),
  created: Joi.date(),
  /* Provider */
  provider: Joi.string(),
  providerData: Joi.object(),
  additionalProvidersData: Joi.object(),
  /* Password */
  password: Joi.zxcvbn()
    .strength(config.zxcvbn.minimumScore)
    .min(config.zxcvbn.minSize)
    .max(config.zxcvbn.maxSize)
    .default(''),
  resetPasswordToken: Joi.string(),
  resetPasswordExpires: Joi.date(),
});

module.exports = {
  User: UserSchema,
};
