"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config = require(path_1.default.resolve('./config'));
const auth = require('../../controllers/auth.controller');
const callbackURL = `${config.api.protocol}://${config.api.host}${config.api.port ? ':' : ''}${config.api.port ? config.api.port : ''}/${config.api.base}/auth/google/callback`;
/**
 * @desc function to prepare map callback to user profile
 */
async function prepare(accessToken, refreshToken, profile, cb) {
    // Set the provider data and include tokens
    const providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
    // Create the user OAuth profile
    const userProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        avatar: providerData.picture ? providerData.picture : undefined,
        provider: 'google',
        providerData,
    };
    // Save the user OAuth profile
    try {
        const user = await auth.checkOAuthUserProfile(userProfile, 'sub', 'google');
        return cb(null, user);
    }
    catch (err) {
        return cb(err);
    }
}
exports.prepare = prepare;
/**
 * @desc Export oAuth Strategie
 */
exports.default = () => {
    const google = config.oAuth.google ? config.oAuth.google : null;
    // Use google strategy
    if (google && google.clientID && google.clientSecret) {
        passport_1.default.use(new passport_google_oauth20_1.Strategy({
            clientID: google.clientID,
            clientSecret: google.clientSecret,
            callbackURL: google.callbackURL ? google.callbackURL : callbackURL,
            scope: ['profile', 'email'],
        }, (a, r, p, cb) => prepare(a, r, p, cb)));
    }
};
//# sourceMappingURL=google.js.map