/**
 * Module dependencies
* */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));

/**
 * Invoke Uploads Permissions
 */
exports.invokeRolesPolicies = () => {
  policy.Acl.allow([{
    roles: ['user', 'admin'],
    allows: [{
      resources: '/api/uploads/:uploadName',
      permissions: ['get', 'delete'],
    }],
  }]);
};
