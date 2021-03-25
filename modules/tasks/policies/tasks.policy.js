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
      roles: ['user'],
      allows: [
        {
          resources: '/api/tasks',
          permissions: '*',
        },
        {
          resources: '/api/tasks/:taskId',
          permissions: '*',
        },
      ],
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: '/api/tasks/stats',
          permissions: ['get'],
        },
        {
          resources: '/api/tasks',
          permissions: ['get'],
        },
        {
          resources: '/api/tasks/:taskId',
          permissions: ['get'],
        },
      ],
    },
  ]);
};
