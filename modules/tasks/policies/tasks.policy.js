/**
 * Module dependencies
 * */
import path from "path";

import policy from "../../../lib/middlewares/policy.js";

/**
 * Invoke Tasks Permissions
 */
 const invokeRolesPolicies = () => {
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

export default {
  invokeRolesPolicies
}