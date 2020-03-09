/**
 * Module dependencies.
 */
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');

const config = require(path.resolve('./config'));
const options = _.clone(config.joi.validationOptions);
const schema = require('../models/apis.schema');


// Globals
let api;

/**
 * Unit tests
 */
describe('Apis Schema Tests :', () => {
  beforeEach(() => {
    api = {
      title: 'title',
      description: 'do something about something else',
    };
  });

  test('should be valid a api example without problems', (done) => {
    const result = Joi.validate(api, schema.Api, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeFalsy();
    done();
  });

  test('should be able to show an error when trying a schema without title', (done) => {
    api.title = '';

    const result = Joi.validate(api, schema.Api, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeDefined();
    done();
  });

  test('should be able to show an error when trying a schema without description', (done) => {
    api.description = '';

    const result = Joi.validate(api, schema.Api, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeDefined();
    done();
  });

  test('should not show an error when trying a schema with user', (done) => {
    api.user = '507f1f77bcf86cd799439011';

    const result = Joi.validate(api, schema.Api, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeFalsy();
    done();
  });

  test('should be able to show an error when trying a different schema', (done) => {
    api.toto = '';

    const result = Joi.validate(api, schema.Api, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeDefined();
    done();
  });
});
