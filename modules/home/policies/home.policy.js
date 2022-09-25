/**
 * Module dependencies
 * */
import policy from '../../../lib/middlewares/policy.js';

/**
 * Invoke Tasks Permissions
 */
const invokeRolesPolicies = () => {
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

export default {
  invokeRolesPolicies,
};
