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
    roles: ['guest'],
    allows: [{
      resources: '/api/core/releases',
      permissions: ['get'],
    }, {
      resources: '/api/core/changelogs',
      permissions: ['get'],
    }],
  }]);
};
