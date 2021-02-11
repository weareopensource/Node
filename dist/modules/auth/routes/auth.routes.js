"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const path_1 = tslib_1.__importDefault(require("path"));
const model = require(path_1.default.resolve('./lib/middlewares/model'));
const usersSchema = require(path_1.default.resolve('./modules/users/models/user.schema'));
exports.default = (app) => {
    const auth = require(path_1.default.resolve('./modules/auth/controllers/auth.controller'));
    // Setting up the users password api
    app.route('/api/auth/forgot').post(auth.forgot);
    app.route('/api/auth/reset/:token').get(auth.validateResetToken);
    app.route('/api/auth/reset').post(auth.reset);
    // Setting up the users authentication api
    app.route('/api/auth/signup').post(model.isValid(usersSchema.User), auth.signup);
    app.route('/api/auth/signin').post(passport_1.default.authenticate('local'), auth.signin);
    // Jwt reset token
    app.route('/api/auth/token').get(passport_1.default.authenticate('jwt'), auth.token);
    // Setting the oauth routes
    app.route('/api/auth/:strategy').get(auth.oauthCall);
    app.route('/api/auth/:strategy/callback').get(auth.oauthCallback);
    app.route('/api/auth/:strategy/callback').post(auth.oauthCallback); // specific for apple call back
};
//# sourceMappingURL=auth.routes.js.map