"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const path_1 = tslib_1.__importDefault(require("path"));
const passport_jwt_1 = require("passport-jwt");
const UserService = require(path_1.default.resolve('modules/users/services/user.service'));
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.TOKEN;
    }
    return token;
};
async function verifyCallback(jwtPayload, done) {
    try {
        const user = await UserService.getBrut({ id: jwtPayload.userId });
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}
exports.default = ({ jwt }) => {
    const opts = {
        jwtFromRequest: null,
        secretOrKey: undefined,
    };
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = jwt.secret;
    const strategy = new passport_jwt_1.Strategy(opts, verifyCallback);
    passport_1.default.use(strategy);
};
//# sourceMappingURL=jwt.js.map