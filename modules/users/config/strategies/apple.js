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
          clientID: config.oAuth.apple.clientID,
          teamID: config.oAuth.apple.teamID,
          callbackURL: config.oAuth.apple.callbackURL
            ? config.oAuth.apple.callbackURL
            : callbackURL,
          keyID: config.oAuth.apple.keyID,
          privateKeyLocation: config.oAuth.apple.privateKeyLocation
            ? config.oAuth.apple.privateKeyLocation
            : null,
          scope: ['email', 'name'],
        },
        async (accessToken, refreshToken, decodedIdToken, profile, cb) => {
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);
          console.log('decodedIdToken', decodedIdToken);
          console.log('decodedIdToken.sub', decodedIdToken.sub);
          console.log(
            'accessToken.appleProfile.name.firstName',
            accessToken.appleProfile.name.firstName,
          );

          // Set the provider data and include tokens
          const providerData = {};
          providerData.sub = decodedIdToken.sub;
          providerData.accessToken = accessToken;
          providerData.refreshToken = refreshToken;
          providerData.decodedIdToken = decodedIdToken;
          // Create the user OAuth profile
          const providerUserProfile = {
            firstName: accessToken.appleProfile.name.firstName || null,
            lastName: accessToken.appleProfile.name.lastName || null,
            email: accessToken.appleProfile.email || null,
            avatar: undefined,
            provider: 'apple',
            decodedIdToken: providerData.decodedIdToken,
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
