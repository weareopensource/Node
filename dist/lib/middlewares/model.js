"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = exports.checkError = exports.getResultFromJoi = exports.cleanError = void 0;
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
const config = require(path_1.default.resolve('./config'));
const responses = require(path_1.default.resolve('./lib/helpers/responses'));
function cleanError(string) {
    return string.replace(/conditions\[(.*?)\]/g, '')
        .replace(/checks\[(.*?)\]/g, '')
        .replace(/"/g, ' ')
        .replace(/\./g, ' ')
        .replace(/ {2}/g, ' ')
        .trim();
}
exports.cleanError = cleanError;
/**
 * get Joi result
 */
function getResultFromJoi(body, schema, options) {
    return schema.validate(body, options, (err, data) => {
        if (err) {
            const output = {
                status: 'failed',
                error: {
                    original: err._object,
                    // fetch only message and type from each error
                    details: lodash_1.default.map(err.details, ({ message, type, }) => ({
                        message: message.replace(/['"]/g, ''),
                        type,
                    })),
                },
            };
            return output;
        }
        return data;
    });
}
exports.getResultFromJoi = getResultFromJoi;
/**
 * check error and return if needed
 */
function checkError(result) {
    if (result && result.error) {
        if (result.error.original && (result.error.original.password || result.error.original.firstname))
            result.error.original = lodash_1.default.pick(result.error.original, config.whitelists.users.default);
        let description = '';
        result.error.details.forEach((err) => {
            const message = cleanError(err.message);
            description += (`${message.charAt(0).toUpperCase() + message.slice(1).toLowerCase()}. `);
        });
        if (result.error._original && (result.error._original.password || result.error._original.firstname))
            result.error._original = lodash_1.default.pick(result.error._original, config.whitelists.users.default);
        return description;
    }
    return false;
}
exports.checkError = checkError;
/**
 * Check model is Valid with Joi schema
 */
function isValid(schema) {
    return (req, res, next) => {
        const method = req.method.toLowerCase();
        const options = lodash_1.default.clone(config.joi.validationOptions);
        if (lodash_1.default.includes(config.joi.supportedMethods, method)) {
            if (method === 'put') {
                options.noDefaults = true;
            }
            // Validate req.body using the schema and validation options
            const result = getResultFromJoi(req.body, schema, options);
            // check error
            const error = checkError(result);
            if (error)
                return responses.error(res, 422, 'Schema validation error', error)(result.error);
            // else return req.body with the data after Joi validation
            req.body = result.value;
            return next();
        }
        next();
    };
}
exports.isValid = isValid;
//# sourceMappingURL=model.js.map