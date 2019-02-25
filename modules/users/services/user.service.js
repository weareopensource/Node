/**
 * Module dependencies
 */
const path = require('path');
const bcrypt = require('bcrypt');
const generatePassword = require('generate-password');
const zxcvbn = require('zxcvbn');

const config = require(path.resolve('./config'));
const ApiError = require(path.resolve('./lib/helpers/ApiError'));
const UserRepository = require('../repositories/user.repository');

const SALT_ROUNDS = 10;

/**
 * @desc Function remove sensitive data of user object
 * @param {Object} user
 * @return {Object} user
 */
exports.removeSensitive = (user) => {
  // @TODO instead of blacklisting unwanted properties we should instead only return a newly composed object of expected properties otherwise we return fields from the repository like mongo's __v field
  user.salt = undefined;
  return user;
};

/**
 * @desc Function to ask repository to create a  user (define provider, check & haspassword, save)
 * @param {Object} user
 * @return {Promise} user
 */
exports.save = async (user) => {
  // Set provider to local
  if (!user.provider) {
    user.provider = 'local';
  }
  // confirming to secure password policies
  if (user.password) {
    const validPassword = zxcvbn(user.password);
    if (!validPassword || !validPassword.score || validPassword.score < config.zxcvbn.minimumScore) {
      throw new ApiError(`${validPassword.feedback.warning}. ${validPassword.feedback.suggestions.join('. ')}`);
    }
    // When password is provided we need to make sure we are hashing it
    user.password = await this.hashPassword(user.password);
  }
  const result = await UserRepository.create(user);
  // Remove sensitive data before return
  return Promise.resolve(this.removeSensitive(result));
};

/**
 * @desc Function to ask repository to delete a user
 * @param {Object} user
 * @return {Promise} user
 */
exports.remove = async (user) => {
  const result = await UserRepository.delete(user);
  return Promise.resolve(result);
};


/**
 * @desc Function to authenticate user)
 * @param {String} email
 * @param {String} password
 * @return {Object} user
 */
exports.authenticate = async (email, password) => {
  const user = await UserRepository.getByEmail(email);
  if (!user) throw new ApiError('invalid user or password');
  if (await this.comparePassword(password, user.password)) return this.deserialize(user);
  throw new ApiError('invalid user or password');
};

/**
 * @desc Function to compare passwords
 * @param {String} userPassword
 * @param {String} storedPassword
 * @return {Boolean} true/false
 */
exports.comparePassword = async (userPassword, storedPassword) => bcrypt.compare(String(userPassword), String(storedPassword));

/**
 * @desc Function to hash passwords
 * @param {String} password
 * @return {String} password hashed
 */
exports.hashPassword = password => bcrypt.hash(String(password), SALT_ROUNDS);

/**
 * @desc Function to deserialize user
 * @param {Object} user
 * @return {Object} user
 */
exports.deserialize = (user) => {
  if (!user || typeof user !== 'object') return null;

  return {
    id: user.id,
    displayName: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    provider: user.provider,
    roles: user.roles,
    profileImageURL: user.profileImageURL,
  };
};


/**
 * @desc Function to ask repository to get a user
 * @param {Object} user
 * @return {Object} user
 */
exports.get = async (user) => {
  if (user.id) {
    const result = await UserRepository.getById(user.id);
    return Promise.resolve(result);
  }
  if (user.email) {
    const result = await UserRepository.getByEmail(user.email);
    return Promise.resolve(result);
  }
  throw new ApiError('invalid user');
};

/**
 * @desc Function to ask repository to get a user and deserialize
 * @param {Object} user
 * @return {Object} user
 */
exports.getUserDeserializedById = async (id) => {
  const user = await UserRepository.getById(id);
  return this.deserialize(user);
};

/**
 * @desc Seed : Function to generateRandomPassphrase
 * Generates a random passphrase that passes the zxcvbn test
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required zxcvbn strength tests, and not the optional tests.
 * @return {Promise} user
 */
exports.generateRandomPassphrase = () => new Promise((resolve, reject) => {
  let password = '';
  const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');
  // iterate until the we have a valid passphrase
  // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
  while (password.length < 20 || repeatingCharacters.test(password)) {
    // build the random password
    password = generatePassword.generate({
      length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
      numbers: true,
      symbols: false,
      uppercase: true,
      excludeSimilarCharacters: true,
    });

    // check if we need to remove any repeating characters
    password = password.replace(repeatingCharacters, '');
  }
  // Send the rejection back if the passphrase fails to pass the strength test
  if (zxcvbn(password).score < config.zxcvbn.minimumScore) {
    reject(new Error('An unexpected problem occured while generating the random passphrase'));
  } else {
    // resolve with the validated passphrase
    resolve(password);
  }
});
