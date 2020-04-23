/**
 * Module dependencies
* */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));

/**
 * Invoke Historys Permissions
 */
exports.invokeRolesPolicies = () => {
  policy.Acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/historys',
      permissions: ['get'],
    }, {
      resources: '/api/historys/:historyId',
      permissions: ['get'],
    }],
  }]);
};
