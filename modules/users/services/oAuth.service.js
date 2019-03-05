
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const config = require(path.resolve('./config'));
const ApiError = require(path.resolve('./lib/helpers/ApiError'));
const IdTokenVerifier = require('idtoken-verifier');
const rp = require('request-promise');
const UserRepository = require('../repositories/user.repository');

const client = new OAuth2Client(config.google.clientId);
const microsoftValidator = rp.get(config.microsoft.discovery)
  .then(res => JSON.parse(res))
  .then(({ jwks_uri: jwksUri }) => new IdTokenVerifier({
    issuer: config.microsoft.issuer,
    jwksURI: jwksUri,
    audience: config.microsoft.clientId,
  }));

/**
 * @desc Function to ask repository to generate unique username for one username
 * @param {String} possible username
 * @return {Promise} resolved username
 */
exports.generateUniqueUsername = async (username, suffix) => {
  username = (suffix || '');

  const result = await UserRepository.get({ username });
  if (!result) return Promise.resolve(username);

  try {
    return await this.generateUniqueUsername(username, (suffix || 0) + 1);
  } catch (err) {
    throw new ApiError(err);
  }
};

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
  user.username = `${user.firstName} ${user.lastName}`;
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
        username: name,
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
