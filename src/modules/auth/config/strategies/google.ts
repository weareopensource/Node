/**
 * Module dependencies
 */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../../../../config';
import auth from '../../controllers/auth.controller';

const callbackURL = `${config.api.protocol}://${config.api.host}${
  config.api.port ? ':' : ''
}${config.api.port ? config.api.port : ''}/${
  config.api.base
}/auth/google/callback`;

/**
 * @desc function to prepare map callback to user profile
 */
export async function prepare(accessToken: string, refreshToken: string, profile: any, cb: (err, user?: any) => any) {
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
  } catch (err) {
    return cb(err);
  }
}

/**
 * @desc Export oAuth Strategie
 */
export default () => {
  const google = config.oAuth.google ? config.oAuth.google : null;
  // Use google strategy
  if (google && google.clientID && google.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: google.clientID,
          clientSecret: google.clientSecret,
          callbackURL: google.callbackURL ? google.callbackURL : callbackURL,
          scope: ['profile', 'email'],
        },
        (a, r, p, cb) => prepare(a, r, p, cb),
      ),
    );
  }
};
