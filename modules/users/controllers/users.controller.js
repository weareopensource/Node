/**
 * Module dependencies
 */
const _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./users/users.authentication.controller'),
  require('./users/users.password.controller'),
  require('./users/users.profile.controller'),
  require('./users/users.images.controller'),
  require('./users/users.data.controller'),
);
