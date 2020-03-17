/**
 * Module dependencies
* */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));

/**
 * Invoke Apis Permissions
 */
exports.invokeRolesPolicies = () => {
  policy.Acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/apis',
      permissions: '*',
    }, {
      resources: '/api/apis/:apiId',
      permissions: '*',
    }, {
      resources: '/api/apis/load/:apiId',
      permissions: '*',
    }, {
      resources: '/api/apis/data/:apiId',
      permissions: '*',
    }],
  }]);
};
