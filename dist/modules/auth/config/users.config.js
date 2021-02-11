"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const config = require(path_1.default.resolve('./config'));
const UserService = require(path_1.default.resolve('modules/users/services/user.service'));
/**
 * Module init function
 */
exports.default = (app) => {
    // Serialize identifiable user's information to the session
    // so that it can be pulled back in another request
    passport_1.default.serializeUser(({ id }, done) => {
        done(null, id);
    });
    // Deserialize get the user identifying information that we saved
    // in `passport.serializeUser()` and resolves the user account
    // from it so it can be saved in `req.user`
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await UserService.get({ id });
            return done(null, user);
        }
        catch (err) {
            return done(err, null);
        }
    });
    // Initialize strategies
    config.utils.getGlobbedPaths(path_1.default.join(__dirname, './strategies/**/*.js')).forEach((strategy) => {
        require(path_1.default.resolve(strategy))(config);
    });
    // Add passport's middleware
    app.use(passport_1.default.initialize());
};
//# sourceMappingURL=users.config.js.map