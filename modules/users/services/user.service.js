/**
 * Module dependencies
 */
const path = require('path');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const generatePassword = require('generate-password');
const zxcvbn = require('zxcvbn');
const fs = require('fs');
const multer = require('multer');

const config = require(path.resolve('./config'));
const AppError = require(path.resolve('./lib/helpers/AppError'));
const imageFileFilter = require(path.resolve('./lib/services/multer')).imageFileFilter;
const UserRepository = require('../repositories/user.repository');

const saltRounds = 10;

/**
 * @desc Local function to removeSensitive data from user
 * @param {Object} user
 * @return {Object} user
 */
const removeSensitive = (user) => {
  if (!user || typeof user !== 'object') return null;
  return _.assignIn(user, _.pick(user, config.whitelists.users.default));
};

/**
 * @desc Function to get all users in db
 * @return {Promise} All users
 */
exports.list = async () => {
  const result = await UserRepository.list();
  return Promise.resolve(result);
};

/**
 * @desc Function to ask repository to create a  user (define provider, check & haspassword, save)
 * @param {Object} user
 * @return {Promise} user
 */
exports.create = async (user) => {
  // Set provider to local
  if (!user.provider) user.provider = 'local';
  // confirming to secure password policies
  if (user.password) {
    // done in model, let this comment for information if one day joi.zxcvbn is not ok / sufficient
    // const validPassword = zxcvbn(user.password);
    // if (!validPassword || !validPassword.score || validPassword.score < config.zxcvbn.minimumScore) {
    //   throw new AppError(`${validPassword.feedback.warning}. ${validPassword.feedback.suggestions.join('. ')}`);
    // }
    // When password is provided we need to make sure we are hashing it
    user.password = await this.hashPassword(user.password);
  }
  const result = await UserRepository.create(user);
  // Remove sensitive data before return
  return Promise.resolve(removeSensitive(result));
};

/**
 * @desc Function to ask repository to get a user by id or email
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
exports.get = async (user) => {
  const result = await UserRepository.get(user);
  return Promise.resolve(removeSensitive(result));
};

/**
 * @desc Function to ask repository to search users by request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
exports.search = async (input) => {
  const result = await UserRepository.search(input);
  return Promise.resolve(removeSensitive(result));
};

/**
 * @desc Functio to ask repository to update a user
 * @param {Object} user - original user
 * @param {Object} body - user edited
 * @param {boolean} admin - true if admin update
 * @return {Promise} user -
 */
exports.update = async (user, body, option) => {
  if (!option) user = _.assignIn(user, _.pick(body, config.whitelists.users.update));
  else if (option === 'admin') user = _.assignIn(user, _.pick(body, config.whitelists.users.updateAdmin));
  else if (option === 'recover') user = _.assignIn(user, _.pick(body, config.whitelists.users.recover));

  user.updated = Date.now();
  user.displayName = `${user.firstName} ${user.lastName}`;

  const result = await UserRepository.update(user);
  return Promise.resolve(removeSensitive(result));
};

/**
 * @desc Function to ask repository to a user from db by id or email
 * @param {Object} user
 * @return {Promise} result & id
 */
exports.delete = async (user) => {
  const result = await UserRepository.delete(user);
  return Promise.resolve(result);
};

/**
 * @desc Upload new image based on multer configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Promise} result
 */
exports.uploadImage = async (req, res, config) => new Promise((resolve, reject) => {
  // upload
  const multerConfig = config;
  multerConfig.fileFilter = imageFileFilter;
  const upload = multer(multerConfig)
    .single('newProfilePicture');

  upload(req, res, (uploadError) => {
    if (uploadError) reject(uploadError);
    else resolve();
  });
});

/**
 * @desc Delete image at this pa†h
 * @param {String} path
 * @return {Promise} result
 */
exports.deleteImage = async (path) => fs.unlink(path);

/**
 * @desc Function to authenticate user)
 * @param {String} email
 * @param {String} password
 * @return {Object} user
 */
exports.authenticate = async (email, password) => {
  const user = await UserRepository.get({ email });
  if (!user) throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR' });
  if (await this.comparePassword(password, user.password)) return removeSensitive(user);
  throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR' });
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
exports.hashPassword = (password) => bcrypt.hash(String(password), saltRounds);

/**
 * @desc Function to hash passwords
 * @param {String} password
 * @return {String} password hashed
 */
exports.checkPassword = (password) => {
  const result = zxcvbn(password);
  if (result.score < config.zxcvbn.minimumScore) {
    throw new AppError('Password too weak.', {
      code: 'SERVICE_ERROR',
      details: result.feedback.suggestions.map((s) => ({ message: s })),
    });
  } else {
    return password;
  }
};

/**
 * @desc Seed : Function to generateRandomPassphrase
 * Generates a random passphrase that passes the zxcvbn test
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required zxcvbn strength tests, and not the optional tests.
 * @return {Promise} user
 */
exports.generateRandomPassphrase = () => {
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
  return this.checkPassword(password);
};
