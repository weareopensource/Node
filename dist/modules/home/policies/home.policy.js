"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
* */
const path_1 = tslib_1.__importDefault(require("path"));
const policy = require(path_1.default.resolve('./lib/middlewares/policy'));
/**
 * Invoke Tasks Permissions
 */
function invokeRolesPolicies() {
    policy.Acl.allow([{
            roles: ['guest'],
            allows: [{
                    resources: '/api/home/releases',
                    permissions: ['get'],
                }, {
                    resources: '/api/home/changelogs',
                    permissions: ['get'],
                }, {
                    resources: '/api/home/team',
                    permissions: ['get'],
                }, {
                    resources: '/api/home/pages/:name',
                    permissions: ['get'],
                }],
        }]);
}
exports.default = invokeRolesPolicies;
//# sourceMappingURL=home.policy.js.map