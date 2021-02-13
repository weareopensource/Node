/**
 * Module dependencies
 */
import _ from 'lodash';

/**
 * Extend user's controller
 */
export default _.extend(
  require('./auth/auth.authentication.controller'),
  require('./auth/auth.password.controller'),
);
