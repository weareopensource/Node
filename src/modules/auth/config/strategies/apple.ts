/**
 * Module dependencies
 */
import passport from 'passport';
import AppleStrategy from 'passport-apple';
import { NodeRequest } from '../../../../lib/helpers/responses';
import config from '../../../../config';
import auth from '../../controllers/auth.controller';

const callbackURL = `${config.api.protocol}://${config.api.host}${
  config.api.port ? ':' : ''
}${config.api.port ? config.api.port : ''}/${
  config.api.base
}/auth/apple/callback`;

/**
 * @desc function to prepare map callback to user profile
 */
export async function prepare(req: NodeRequest, accessToken: string, refreshToken: string, decodedIdToken: any, profile, cb) {
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
  } catch (err) {
    return cb(err);
  }
}

export default () => {
  const apple = config.oAuth.apple ? config.oAuth.apple : null;
  // Use google strategy
  if (
    apple &&
    apple.clientID &&
    apple.teamID &&
    apple.keyID
  ) {
    passport.use(
      new AppleStrategy(
        {
          clientID: apple.clientID,
          teamID: apple.teamID,
          callbackURL: apple.callbackURL ? apple.callbackURL : callbackURL,
          keyID: config.oAuth.apple.keyID,
          privateKeyLocation: apple.privateKeyLocation ? apple.privateKeyLocation : undefined,
          scope: ['email', 'name'],
          passReqToCallback: true,
        },
        (req, a, r, d, p, cb) => prepare(req, a, r, d, p, cb),
      ),
    );
  }
};
