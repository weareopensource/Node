/**
 * Module dependencies
* */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));

/**
 * Invoke Subscriptions Permissions
 */
exports.invokeRolesPolicies = () => {
  policy.Acl.allow([{
    roles: ['guest'],
    allows: [{
      resources: '/api/subscriptions',
      permissions: ['post'],
    }, {
      resources: '/api/subscriptions/:subscriptionId',
      permissions: ['get', 'put', 'delete'],
    }],
  }, {
    roles: ['admin'],
    allows: [{
      resources: '/api/subscriptions',
      permissions: '*',
    }, {
      resources: '/api/subscriptions/:subscriptionId',
      permissions: '*',
    }],
  }]);
};
