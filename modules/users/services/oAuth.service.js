
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const config = require(path.resolve('./config'));
const IdTokenVerifier = require('idtoken-verifier');
const rp = require('request-promise');
const UserRepository = require('../repositories/user.repository');

const client = new OAuth2Client(config.google.clientId);
const microsoftValidator = rp.get(config.microsoft.discovery)
  .then((res) => JSON.parse(res))
  .then(({ jwks_uri: jwksUri }) => new IdTokenVerifier({
    issuer: config.microsoft.issuer,
    jwksURI: jwksUri,
    audience: config.microsoft.clientId,
  }));

/**
 * @desc Function to verify Google Token
 * @param {String} idToken
 * @return {Promise} user
 */
const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
  });
  const payload = ticket.getPayload();
  const user = {
    sub: payload.sub,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    profileImageURL: payload.picture,
  };
  user.provider = 'google';
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return user;
};

/**
 * @desc Function to verify Microsoft Token
 * @param {String} idToken
 * @return {Promise} user
 */
const verifyMicrosoftToken = async (idToken) => {
  const validator = await microsoftValidator;
  return new Promise((resolve, reject) => {
    validator.verify(idToken, validator.decode(idToken)
      .payload.nonce, (err, {
      sub,
      name,
      preferred_username: preferredUsername,
    }) => {
      if (err) return reject(err);
      return resolve({
        sub,
        firstName: name,
        email: preferredUsername,
        provider: 'microsoft',
      });
    });
  }).catch(console.log);
};

/**
 * @desc Function to verify Microsoft Token
 * @param {String} idToken
 * @return {Promise} user
 */
exports.addUser = async (provider, idToken) => {
  let user;
  switch (provider) {
    case 'google':
      user = await verifyGoogleToken(idToken);
      break;
    case 'microsoft':
      user = await verifyMicrosoftToken(idToken);
      break;
    default:
  }
  if (!user) return null;

  return UserRepository.search({
    sub: user.sub,
  });
};
