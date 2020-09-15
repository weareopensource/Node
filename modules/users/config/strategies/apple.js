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
          passReqToCallback: false,
        },
        async (accessToken, refreshToken, decodedIdToken, profile, cb) => {
          console.log('profile', profile);
          console.log('decodedIdTokenId', decodedIdToken.id);
          console.log('decodedIdToken', decodedIdToken);
          // Set the provider data and include tokens
          const providerData = {};
          providerData.appleProfile = accessToken.appleProfile;
          providerData.refreshToken = refreshToken;
          providerData.decodedIdTokenId = decodedIdToken.id;
          // Create the user OAuth profile
          const providerUserProfile = {
            firstName:
              accessToken.appleProfile && accessToken.appleProfile.name
                ? accessToken.appleProfile.name.firstName
                : null,
            lastName:
              accessToken.appleProfile && accessToken.appleProfile.name
                ? accessToken.appleProfile.name.lastName
                : null,
            email: accessToken.appleProfile
              ? accessToken.appleProfile.email
              : null,
            avatar: null,
            provider: 'apple',
            decodedIdTokenId: providerData.decodedIdTokenId,
            providerData,
          };
          // Save the user OAuth profile
          try {
            const user = await users.saveOAuthUserProfile(
              providerUserProfile,
              'decodedIdTokenId',
              'apple',
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
