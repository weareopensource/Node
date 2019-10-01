
/**
 * Module dependencies
 */
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');

const config = require(path.resolve('./config'));
const responses = require(path.resolve('./lib/helpers/responses'));

/**
 * get Joi result
 */
const getResultFromJoi = (body, schema, options) => Joi.validate(body, schema, options, (err, data) => {
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
    const result = getResultFromJoi(req.body, schema, options);
    // if error
    if (result && result.error) {
      if (result.error.original && (result.error.original.password || result.error.original.firstname)) result.error.original = _.pick(result.error.original, config.whitelists.users.default);
      let desription = '';
      result.error.details.forEach((err) => {
        desription += (`${err.message.charAt(0).toUpperCase() + err.message.slice(1).toLowerCase()}. `);
      });
      return responses.error(res, 422, 'Schema validation error', desription)(result.error);
    }
    // else return req.body with the data after Joi validation
    req.body = result;
    return next();
  }
  next();
};
