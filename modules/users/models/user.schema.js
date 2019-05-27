/**
 * Module dependencies
 */
const joiZxcvbn = require('joi-zxcvbn');
const PlainJoi = require('joi');
const path = require('path');

const Joi = PlainJoi.extend(joiZxcvbn(PlainJoi));
const config = require(path.resolve('./config'));

/**
 * User Data Schema
 */
const UserSchema = Joi.object().keys({
  sub: Joi.string().trim().default(''),
  firstName: Joi.string().alphanum().min(1).max(30)
    .trim()
    .required(),
  lastName: Joi.string().alphanum().min(1).max(30)
    .trim()
    .required(),
  displayName: Joi.string().trim(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  profileImageURL: Joi.string(),
  roles: Joi.array().items(Joi.string().valid(config.whitelists.users.roles)).min(1).default(['user']),
  /* Extra */
  updated: Joi.date(),
  created: Joi.date().default(Date.now, 'current date'),
  /* Provider */
  provider: Joi.string(),
  providerData: Joi.object(),
  additionalProvidersData: Joi.object(),
  /* Password */
  password: Joi.string().min(4).max(128).default('')
    .zxcvbn(config.zxcvbn.minimumScore),
  resetPasswordToken: Joi.string(),
  resetPasswordExpires: Joi.date(),
});

module.exports = {
  User: UserSchema,
};
