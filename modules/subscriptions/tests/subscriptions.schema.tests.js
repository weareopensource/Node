/**
 * Module dependencies.
 */
const _ = require('lodash');
const path = require('path');

const config = require(path.resolve('./config'));
const options = _.clone(config.joi.validationOptions);
const schema = require('../models/subscriptions.schema');

// Globals
let subscription;

/**
 * Unit tests
 */
describe('Subscriptions Schema Tests :', () => {
  beforeEach(() => {
    subscription = {
      email: 'test@gmail.com',
      news: true,
    };
  });

  test('should be valid a subscription example without problems', (done) => {
    const result = schema.Subscription.validate(subscription, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeFalsy();
    done();
  });

  test('should be able to show an error when trying a schema without title', (done) => {
    subscription.email = '';

    const result = schema.Subscription.validate(subscription, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeDefined();
    done();
  });

  test('should be able to show an error when trying a schema without news', (done) => {
    subscription.news = null;

    const result = schema.Subscription.validate(subscription, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeDefined();
    done();
  });

  test('should not show an error when trying a schema with user', (done) => {
    subscription.user = '507f1f77bcf86cd799439011';

    const result = schema.Subscription.validate(subscription, options);
    expect(typeof result).toBe('object');
    expect(result.error).toBeFalsy();
    done();
  });

  test('should be able remove unknown when trying a different schema', (done) => {
    subscription.toto = '';

    const result = schema.Subscription.validate(subscription, options);
    expect(result.toto).toBeUndefined();
    done();
  });
});
