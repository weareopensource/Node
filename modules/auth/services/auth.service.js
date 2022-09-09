/**
 * Module dependencies
 */
import bcrypt from "bcrypt";
import generatePassword from "generate-password";
import zxcvbn from "zxcvbn";

import config from "../../../config/index.js";
import AppError from "../../../lib/helpers/AppError.js";
import UserRepository from "../../users/repositories/user.repository.js";
import UserService from "../../users/services/user.service.js";

const saltRounds = 10;

/**
 * @desc Function to authenticate user)
 * @param {String} email
 * @param {String} password
 * @return {Object} user
 */
const authenticate = async (email, password) => {
  const user = await UserRepository.get({ email });
  if (!user) throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR' });
  if (await comparePassword(password, user.password)) return UserService.removeSensitive(user);
  throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR' });
};

/**
 * @desc Function to compare passwords
 * @param {String} userPassword
 * @param {String} storedPassword
 * @return {Boolean} true/false
 */
const comparePassword = async (userPassword, storedPassword) => bcrypt.compare(String(userPassword), String(storedPassword));

/**
 * @desc Function to hash passwords
 * @param {String} password
 * @return {String} password hashed
 */
const hashPassword = (password) => bcrypt.hash(String(password), saltRounds);

/**
 * @desc Function to hash passwords
 * @param {String} password
 * @return {String} password hashed
 */
const checkPassword = (password) => {
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
const generateRandomPassphrase = () => {
  let password = '';
  const repeatingCharacters = /(.)\1{2,}/g;
  // iterate until the we have a valid passphrase
  // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
  while (password.length < 20 || repeatingCharacters.test(password)) {
    // build the random password
    password = generatePassword.generate({
      length: Math.floor(Math.random() * 20) + 20, // randomize length between 20 and 40 characters
      numbers: true,
      symbols: false,
      uppercase: true,
      excludeSimilarCharacters: true,
    });

    // check if we need to remove any repeating characters
    password = password.replace(repeatingCharacters, '');
  }
  // Send the rejection back if the passphrase fails to pass the strength test
  return checkPassword(password);
};

export default {
  authenticate,
  comparePassword,
  hashPassword,
  checkPassword,
  generateRandomPassphrase
}