/**
 * Module dependencies
 */
import Joi from '@hapi/joi';

/**
 *  Data Schema
 */
const TaskSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  description: Joi.string().allow('').default('').required(),
  user: Joi.string().trim().default(''),
});

export default TaskSchema;
