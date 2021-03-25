/**
 * Module dependencies
 * */
const path = require('path');

const policy = require(path.resolve('./lib/middlewares/policy'));

/**
 * Invoke Tasks Permissions
 */
exports.invokeRolesPolicies = () => {
  policy.Acl.allow([
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/home/releases',
          permissions: ['get'],
        },
        {
          resources: '/api/home/changelogs',
          permissions: ['get'],
        },
        {
          resources: '/api/home/team',
          permissions: ['get'],
        },
        {
          resources: '/api/home/pages/:name',
          permissions: ['get'],
        },
      ],
    },
  ]);
};
