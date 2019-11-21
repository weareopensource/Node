/**
 * Module dependencies
 */
const Joi = require('joi');

/**
 *  Data Schema
 */
const TaskSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  description: Joi.string().allow('').default(''),
  user: Joi.string().trim().default(''),
});

module.exports = {
  Task: TaskSchema,
};
