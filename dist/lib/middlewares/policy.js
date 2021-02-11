"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.isAllowed = exports.Acl = void 0;
const tslib_1 = require("tslib");
const acl_1 = tslib_1.__importDefault(require("acl"));
const responses_1 = require("../helpers/responses");
/* eslint new-cap: 0 */
exports.Acl = new acl_1.default(new acl_1.default.memoryBackend()); // Using the memory backend
function isAllowed(req, res, next) {
    const roles = (req.user) ? req.user.roles : ['guest'];
    exports.Acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isGood) => {
        if (err)
            return responses_1.error(res, 500, 'Server Error', 'Unexpected authorization error')(err); // An authorization error occurred
        if (isGood)
            return next(); // Access granted! Invoke next middleware
        return responses_1.error(res, 403, 'Unauthorized', 'User is not authorized')();
    });
}
exports.isAllowed = isAllowed;
function isOwner(req, res, next) {
    if (req.user && req.isOwner && String(req.isOwner) === String(req.user._id)) {
        return next();
    }
    return res.status(403).json({
        message: 'User is not authorized',
    });
}
exports.isOwner = isOwner;
//# sourceMappingURL=policy.js.map