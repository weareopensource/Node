
/**
 * Module dependencies
 */
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');

const config = require(path.resolve('./config'));

/**
 * get Joi Error
 */
const getErrorMessageFromJoi = (err) => {
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
};

/**
 * Check model is Valid with Joi schema
 */
module.exports.isValid = UserSchema => (req, res, next) => {
  const method = req.method.toLowerCase();
  const options = _.clone(config.joi.validationOptions);
  if (_.includes(config.joi.supportedMethods, method)) {
    if (method === 'put') options.noDefaults = true;
    // Validate req.body using the schema and validation options
    Joi.validate(req.body, UserSchema, options, (err, data) => {
      if (err) return res.status(422).json(getErrorMessageFromJoi(err));
      // Replace req.body with the data after Joi validation
      req.body = data;
      return next();
    });
  } else {
    next();
  }
};
