/**
 * Module dependencies
 */
const zxcvbn = require('zxcvbn');
const path = require('path');

const config = require(path.resolve('./config'));

/**
 * @desc Joi extension for  zxcvbn
 */
exports.joiZxcvbn = (joi) => ({
  type: 'zxcvbn',
  base: joi.string(),
  messages: {
    'password.common': 'password is too common',
    'password.strength': 'password must have a strength of at least {{#minScore}}',
  },
  rules: {
    strength: {
      method(minScore) {
        // this.addRule throws unknown function error
        return this.$_addRule({ name: 'strength', args: { minScore } });
      },
      args: [
        {
          name: 'minScore',
          ref: true,
          assert: joi.number().required(),
          message: 'must be a number',
        },
      ],
      validate(value, helpers, args) {
        if (config.zxcvbn.forbiddenPasswords.includes(value)) {
          return helpers.error('password.common');
        }
        if (zxcvbn(value).score < args.minScore) {
          return helpers.error('password.strength', { minScore: args.minScore });
        }
        return value;
      },
    },
  },
});
