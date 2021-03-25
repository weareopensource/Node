/**
 * Module dependencies
 */
const _ = require('lodash');
const path = require('path');

const config = require(path.resolve('./config'));
const responses = require(path.resolve('./lib/helpers/responses'));

module.exports.cleanError = (string) =>
  string
    .replace(/conditions\[(.*?)\]/g, '')
    .replace(/checks\[(.*?)\]/g, '')
    .replace(/"/g, ' ')
    .replace(/\./g, ' ')
    .replace(/ {2}/g, ' ')
    .trim();

/**
 * get Joi result
 */
module.exports.getResultFromJoi = (body, schema, options) =>
  schema.validate(body, options, (err, data) => {
    if (err) {
      const output = {
        status: 'failed',
        error: {
          original: err._object,
          // fetch only message and type from each error
          details: _.map(err.details, ({ message, type }) => ({
            message: message.replace(/['"]/g, ''),
            type,
          })),
        },
      };
      return output;
    }
    return data;
  });

/**
 * check error and return if needed
 */
module.exports.checkError = (result) => {
  if (result && result.error) {
    if (result.error.original && (result.error.original.password || result.error.original.firstname))
      result.error.original = _.pick(result.error.original, config.whitelists.users.default);
    let description = '';
    result.error.details.forEach((err) => {
      const message = this.cleanError(err.message);
      description += `${message.charAt(0).toUpperCase() + message.slice(1).toLowerCase()}. `;
    });

    if (result.error._original && (result.error._original.password || result.error._original.firstname))
      result.error._original = _.pick(result.error._original, config.whitelists.users.default);
    return description;
  }
  return false;
};

/**
 * Check model is Valid with Joi schema
 */
module.exports.isValid = (schema) => (req, res, next) => {
  const method = req.method.toLowerCase();
  const options = _.clone(config.joi.validationOptions);
  if (_.includes(config.joi.supportedMethods, method)) {
    if (method === 'put') {
      options.noDefaults = true;
    }
    // Validate req.body using the schema and validation options
    const result = this.getResultFromJoi(req.body, schema, options);
    // check error
    const error = this.checkError(result);
    if (error) return responses.error(res, 422, 'Schema validation error', error)(result.error);

    // else return req.body with the data after Joi validation
    req.body = result.value;
    return next();
  }
  next();
};
