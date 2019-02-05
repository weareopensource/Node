
/**
 * Module dependencies
 */
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');

const config = require(path.resolve('./config'));

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
module.exports.isValid = schema => (req, res, next) => {
  const method = req.method.toLowerCase();
  const options = _.clone(config.joi.validationOptions);
  if (_.includes(config.joi.supportedMethods, method)) {
    if (method === 'put') options.noDefaults = true;
    // Validate req.body using the schema and validation options
    const result = getResultFromJoi(req.body, schema, options);
    // if error
    if (result && result.error) return res.status(422).json(result);
    // else return req.body with the data after Joi validation
    req.body = result;
    return next();
  }
  next();
};
