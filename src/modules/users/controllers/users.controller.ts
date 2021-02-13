/**
 * Module dependencies
 */
import _ from 'lodash';

/**
 * Extend user's controller
 */
export default _.extend(
  require('./users/users.profile.controller'),
  require('./users/users.images.controller'),
);
