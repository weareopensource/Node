/**
 * Module dependencies
* */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));

/**
 * Invoke Tasks Permissions
 */
exports.invokeRolesPolicies = () => {
  policy.Acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*',
    }, {
      resources: '/api/users/:userId',
      permissions: '*',
    }],
  }]);
};
