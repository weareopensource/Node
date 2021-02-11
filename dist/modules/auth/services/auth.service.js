"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassphrase = exports.checkPassword = exports.hashPassword = exports.authenticate = exports.comparePassword = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const generate_password_1 = tslib_1.__importDefault(require("generate-password"));
const zxcvbn_1 = tslib_1.__importDefault(require("zxcvbn"));
const config = require(path_1.default.resolve('./config'));
const AppError = require(path_1.default.resolve('./lib/helpers/AppError'));
const UserRepository = require(path_1.default.resolve('modules/users/repositories/user.repository'));
const UserService = require(path_1.default.resolve('modules/users/services/user.service'));
const saltRounds = 10;
/**
 * @desc Function to compare passwords
 * @param {String} userPassword
 * @param {String} storedPassword
 * @return {Boolean} true/false
 */
async function comparePassword(userPassword, storedPassword) {
    return bcrypt_1.default.compare(String(userPassword), String(storedPassword));
}
exports.comparePassword = comparePassword;
/**
 * @desc Function to authenticate user)
 * @param {String} email
 * @param {String} password
 * @return {Object} user
 */
async function authenticate(email, password) {
    const user = await UserRepository.get({ email });
    if (!user)
        throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR' });
    if (await comparePassword(password, user.password))
        return UserService.removeSensitive(user);
    throw new AppError('invalid user or password.', { code: 'SERVICE_ERROR' });
}
exports.authenticate = authenticate;
/**
 * @desc Function to hash passwords
 * @param {String} password
 * @return {String} password hashed
 */
function hashPassword(password) {
    return bcrypt_1.default.hash(String(password), saltRounds);
}
exports.hashPassword = hashPassword;
/**
 * @desc Function to hash passwords
 * @param {String} password
 * @return {String} password hashed
 */
function checkPassword(password) {
    const result = zxcvbn_1.default(password);
    if (result.score < config.zxcvbn.minimumScore) {
        throw new AppError('Password too weak.', {
            code: 'SERVICE_ERROR',
            details: result.feedback.suggestions.map((s) => ({ message: s })),
        });
    }
    else {
        return password;
    }
}
exports.checkPassword = checkPassword;
/**
 * @desc Seed : Function to generateRandomPassphrase
 * Generates a random passphrase that passes the zxcvbn test
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required zxcvbn strength tests, and not the optional tests.
 * @return {Promise} user
 */
function generateRandomPassphrase() {
    let password = '';
    const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');
    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
        // build the random password
        password = generate_password_1.default.generate({
            length: Math.floor(Math.random() * (20)) + 20,
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
}
exports.generateRandomPassphrase = generateRandomPassphrase;
//# sourceMappingURL=auth.service.js.map