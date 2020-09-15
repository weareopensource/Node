/**
 * Module dependencies
 */
const path = require('path');
const passport = require('passport');
const AppleStrategy = require('passport-apple');

const config = require(path.resolve('./config'));
const users = require('../../controllers/users.controller');

const callbackURL = `${config.api.protocol}://${config.api.host}${
  config.api.port ? ':' : ''
}${config.api.port ? config.api.port : ''}/${
  config.api.base
}/auth/apple/callback`;

module.exports = () => {
  // Use google strategy
  if (
    config.oAuth &&
    config.oAuth.apple &&
    config.oAuth.apple.clientID &&
    config.oAuth.apple.teamID &&
    config.oAuth.apple.keyID
  ) {
    passport.use(
      new AppleStrategy(
        {
          clientID: config.oAuth.google.clientID,
          teamID: config.oAuth.google.teamID,
          callbackURL: config.oAuth.google.callbackURL ? config.oAuth.google.callbackURL : callbackURL,
          keyID: config.oAuth.google.keyID,
          privateKeyLocation: config.oAuth.google.privateKeyLocation
            ? config.oAuth.google.privateKeyLocation
            : null,
          scope: ['email', 'name'],
        },
        async (accessToken, refreshToken, decodedIdToken, profile, cb) => {
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);
          console.log('decodedIdToken', decodedIdToken);
          console.log('profile', profile);

          // Set the provider data and include tokens
          const providerData = profile._json;
          providerData.accessToken = accessToken;
          providerData.refreshToken = refreshToken;
          providerData.decodedIdToken = decodedIdToken;
          // Create the user OAuth profile
          const providerUserProfile = {
            firstName: 'tim',
            lastName: 'apple',
            email: decodedIdToken.email,
            avatar: undefined,
            provider: 'apple',
            decodedIdToken,
            providerData,
          };
          // Save the user OAuth profile
          try {
            await users.saveOAuthUserProfile(
              providerUserProfile,
              'decodedIdToken',
              'apple',
            );
            return cb(null, decodedIdToken);
          } catch (err) {
            return cb(err);
          }
        },
      ),
    );
  }
};
