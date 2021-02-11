"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const auth_service_1 = require("../../services/auth.service");
exports.default = () => {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const user = await auth_service_1.authenticate(email, password);
            if (user)
                return done(null, user);
            return done(null, false, {
                message: 'Invalid email or password',
            });
        }
        catch (err) {
            return done();
        }
    }));
};
//# sourceMappingURL=local.js.map