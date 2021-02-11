"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const zxcvbn_1 = tslib_1.__importDefault(require("zxcvbn"));
const config = require(path_1.default.resolve('./config'));
exports.default = joiZxcvbn;
/**
 * @desc Joi extension for  zxcvbn
 */
function joiZxcvbn(joi) {
    return {
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
                    // @ts-ignore
                    return this.$_addRule({
                        name: 'strength',
                        args: { minScore },
                    });
                },
                args: [
                    {
                        name: 'minScore',
                        ref: true,
                        assert: joi.number()
                            .required(),
                        message: 'must be a number',
                    },
                ],
                validate(value, helpers, args) {
                    if (config.zxcvbn.forbiddenPasswords.includes(value)) {
                        return helpers.error('password.common');
                    }
                    if (zxcvbn_1.default(value).score < args.minScore) {
                        return helpers.error('password.strength', { minScore: args.minScore });
                    }
                    return value;
                },
            },
        },
    };
}
//# sourceMappingURL=joi.js.map