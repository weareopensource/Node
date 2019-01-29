/**
 * Module dependencies.
 */
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');

const config = require(path.resolve('./config'));
const options = _.clone(config.joi.validationOptions);
const schema = require('../models/tasks.server.schema');


// Globals
let task;

/**
 * Unit tests
 */
describe('Tasks Schema Unit Tests:', () => {
  beforeEach(() => {
    task = {
      title: 'title',
      description: 'do something about something else',
      user: '507f1f77bcf86cd799439011',
    };
  });

  describe('Schema Save', () => {
    test('should be valid a task example without problems', (done) => {
      const result = Joi.validate(task, schema.Task, options);
      expect(typeof result).toBe('object');
      expect(result.error).toBeFalsy();
      done();
    });

    test('should be able to show an error when trying a schema without title', (done) => {
      task.title = '';

      const result = Joi.validate(task, schema.Task, options);
      expect(typeof result).toBe('object');
      expect(result.error).toBeDefined();
      done();
    });

    test('should be able to show an error when trying a schema without description', (done) => {
      task.description = '';

      const result = Joi.validate(task, schema.Task, options);
      expect(typeof result).toBe('object');
      expect(result.error).toBeDefined();
      done();
    });

    test('should be able to show an error when trying a schema without user', (done) => {
      task.user = '';

      const result = Joi.validate(task, schema.Task, options);
      expect(typeof result).toBe('object');
      expect(result.error).toBeDefined();
      done();
    });

    test('should be able to show an error when trying a different schema', (done) => {
      task.toto = '';

      const result = Joi.validate(task, schema.Task, options);
      expect(typeof result).toBe('object');
      expect(result.error).toBeDefined();
      done();
    });
  });
});
