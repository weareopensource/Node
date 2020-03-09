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
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/apis',
      permissions: ['get'],
    }, {
      resources: '/api/apis/:apiId',
      permissions: ['get'],
    }],
  }]);
};
