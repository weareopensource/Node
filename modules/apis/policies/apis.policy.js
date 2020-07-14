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
      permissions: ['get', 'post'],
    }, {
      resources: '/api/apis/:apiId',
      permissions: ['get', 'put', 'delete'],
    }, {
      resources: '/api/apis/load/:apiId',
      permissions: ['get'],
    }, {
      resources: '/api/apis/data/:apiId',
      permissions: ['get', 'post'],
    }, {
      resources: '/api/apis/aggregate/:apiId',
      permissions: ['post'],
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/apis/stats',
      permissions: ['get'],
    }],
  }]);
};
