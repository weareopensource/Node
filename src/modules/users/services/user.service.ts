/**
 * Module dependencies
 */
import { hash } from 'bcrypt';
import _ from 'lodash';
import config from '../../../config';
import * as UserRepository from '../repositories/user.repository';

/**
 * @desc Local function to removeSensitive data from user
 * @param {Object} user
 * @return {Object} user
 */
export function removeSensitive(user: any, conf?: any) {
  if (!user || typeof user !== 'object') return null;
  const keys = conf || config.whitelists.users.default;
  return _.pick(user, keys);
}

/**
 * @desc Function to get all users in db
 * @param {String} filter
 * @param {Int} page
 * @param {Int} perPage
 * @return {Promise} users selected
 */
export async function list(filter: RegExp, page?: any, perPage?: any) {
  const result = await UserRepository.list(filter, page, perPage);
  return Promise.resolve(result.map((user) => removeSensitive(user)));
}

/**
 * @desc Function to ask repository to create a  user (define provider, check & haspassword, save)
 * @param {Object} user
 * @return {Promise} user
 */
export async function create(user): Promise<any> {
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
    user.password = await hash(String(user.password), 10);
  }
  const result = await UserRepository.create(user);
  // Remove sensitive data before return
  return Promise.resolve(removeSensitive(result));
}

/**
 * @desc Function to ask repository to search users by request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
export async function search(input) {
  const result = await UserRepository.search(input);
  return Promise.resolve(result.map((user) => removeSensitive(user)));
}

/**
 * @desc Function to ask repository to get a user by id or email
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
export async function get(user) {
  const result = await UserRepository.get(user);
  return Promise.resolve(removeSensitive(result));
}

/**
 * @desc Function to ask repository to get a user by id or email without filter data return (test & intern usage)
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
export async function getBrut(user): Promise<any> {
  return UserRepository.get(user);
}

/**
 * @desc Function to ask repository to update a user
 */
export async function update(user, body, option?: 'admin' | 'recover') {
  if (!option) user = _.assignIn(user, removeSensitive(body, config.whitelists.users.update));
  else if (option === 'admin') user = _.assignIn(user, removeSensitive(body, config.whitelists.users.updateAdmin));
  else if (option === 'recover') user = _.assignIn(user, removeSensitive(body, config.whitelists.users.recover));

  const result = await UserRepository.update(user);
  return Promise.resolve(removeSensitive(result));
}

/**
 * @desc Functio to ask repository to sign terms for current user
 * @param {Object} user - original user
 * @return {Promise} user -
 */
export async function terms(user) {
  user = _.assignIn(user, { terms: new Date() });
  const result = await UserRepository.update(user);
  return Promise.resolve(removeSensitive(result));
}

/**
 * @desc Function to ask repository to a user from db by id or email
 * @param {Object} user
 * @return {Promise} result & id
 */
export async function deleteUser(user) {
  const result = await UserRepository.deleteUser(user);
  return Promise.resolve(result);
}

/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
export async function stats() {
  const result = await UserRepository.stats();
  return Promise.resolve(result);
}
