/**
 * Module dependencies
 */
const _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(require('./auth/auth.authentication.controller'), require('./auth/auth.password.controller'));
