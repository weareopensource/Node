"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_apple_1 = tslib_1.__importDefault(require("passport-apple"));
const config = require(path_1.default.resolve('./config'));
const auth = require('../../controllers/auth.controller');
const callbackURL = `${config.api.protocol}://${config.api.host}${config.api.port ? ':' : ''}${config.api.port ? config.api.port : ''}/${config.api.base}/auth/apple/callback`;
/**
 * @desc function to prepare map callback to user profile
 */
async function prepare(req, accessToken, refreshToken, decodedIdToken, profile, cb) {
    // Set the provider data and include tokens
    const providerData = decodedIdToken;
    providerData.appleProfile = req.appleProfile;
    providerData.accessToken = accessToken || null;
    providerData.refreshToken = refreshToken || null;
    providerData.profile = profile || null;
    providerData.sub = decodedIdToken.sub;
    // Create the user OAuth profile
    const userProfile = {
        firstName: req.appleProfile && req.appleProfile.name ? req.appleProfile.name.firstName : null,
        lastName: req.appleProfile && req.appleProfile.name ? req.appleProfile.name.lastName : null,
        email: req.appleProfile ? req.appleProfile.email : null,
        avatar: null,
        provider: 'apple',
        providerData,
    };
    // Save the user OAuth profile
    try {
        const user = await auth.checkOAuthUserProfile(userProfile, 'sub', 'apple');
        return cb(null, user);
    }
    catch (err) {
        return cb(err);
    }
}
exports.prepare = prepare;
exports.default = () => {
    const apple = config.oAuth.apple ? config.oAuth.apple : null;
    // Use google strategy
    if (apple &&
        apple.clientID &&
        apple.teamID &&
        apple.keyID) {
        passport_1.default.use(new passport_apple_1.default({
            clientID: apple.clientID,
            teamID: apple.teamID,
            callbackURL: apple.callbackURL ? apple.callbackURL : callbackURL,
            keyID: config.oAuth.apple.keyID,
            privateKeyLocation: apple.privateKeyLocation ? apple.privateKeyLocation : null,
            scope: ['email', 'name'],
            passReqToCallback: true,
        }, (req, a, r, d, p, cb) => prepare(req, a, r, d, p, cb)));
    }
};
//# sourceMappingURL=apple.js.map