/**
 * Module dependencies
 */
const PlainJoi = require('@hapi/joi');
const path = require('path');

const joiHelpers = require(path.resolve('./lib/helpers/joi'));
const Joi = PlainJoi.extend(joiHelpers.joiZxcvbn(PlainJoi));
const config = require(path.resolve('./config'));
const names = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

/**
 * User Data Schema
 */
const UserSchema = Joi.object().keys({
  firstName: Joi.string().regex(names).min(1).max(50).trim().required(),
  lastName: Joi.string().regex(names).min(1).max(50).trim().required(),
  bio: Joi.string().max(200).trim().allow('').optional(),
  position: Joi.string().max(50).trim().allow('').optional(),
  email: Joi.string().email(),
  avatar: Joi.string().trim().default('').allow(''),
  roles: Joi.array()
    .items(Joi.string().valid(...config.whitelists.users.roles))
    .min(1)
    .default(['user']),
  /* Provider */
  provider: Joi.string(),
  providerData: Joi.object(),
  /* Password */
  password: Joi.zxcvbn().strength(config.zxcvbn.minimumScore).min(config.zxcvbn.minSize).max(config.zxcvbn.maxSize).default(''),
  resetPasswordToken: Joi.string().allow(null),
  resetPasswordExpires: Joi.date().allow(null),
  // startup requirement
  terms: Joi.date().default(null).optional(), // last check
  // others
  complementary: Joi.object({}).unknown().allow(null).optional(),
});

module.exports = {
  User: UserSchema,
};
