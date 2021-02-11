/**
 * Module dependencies
 */
const Joi = require('@hapi/joi');

/**
 *  Data Schema
 */
const TaskSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  description: Joi.string().allow('').default('').required(),
  user: Joi.string().trim().default(''),
});

module.exports = {
  Task: TaskSchema,
};
