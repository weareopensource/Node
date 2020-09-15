/**
 * Module dependencies
 */
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const config = require(path.resolve('./config'));
const users = require('../../controllers/users.controller');

const callbackURL = `${config.api.protocol}://${config.api.host}${
  config.api.port ? ':' : ''
}${config.api.port ? config.api.port : ''}/${
  config.api.base
}/auth/google/callback`;

module.exports = () => {
  // Use google strategy
  if (
    config.oAuth &&
    config.oAuth.google &&
    config.oAuth.google.clientID &&
    config.oAuth.google.clientSecret
  ) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.oAuth.google.clientID,
          clientSecret: config.oAuth.google.clientSecret,
          callbackURL: config.oAuth.google.callbackURL
            ? config.oAuth.google.callbackURL
            : callbackURL,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, cb) => {
          // Set the provider data and include tokens
          const providerData = profile._json;
          providerData.accessToken = accessToken;
          providerData.refreshToken = refreshToken;
          // Create the user OAuth profile
          const providerUserProfile = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            avatar: providerData.picture ? providerData.picture : undefined,
            provider: 'google',
            sub: providerData.sub,
            providerData,
          };
          // Save the user OAuth profile
          try {
            const user = await users.saveOAuthUserProfile(
              providerUserProfile,
              'sub',
              'google',
            );
            return cb(null, user);
          } catch (err) {
            return cb(err);
          }
        },
      ),
    );
  }
};
