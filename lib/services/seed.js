/**
 * Module dependencies.
 */
const _ = require('lodash');
const chalk = require('chalk');
const path = require('path');

const AppError = require(path.resolve('./lib/helpers/AppError'));
const config = require('../../config');


// global seed options object
let seedOptions = {};

// save the specified user with the password provided from the resolved promise
const seedTheUser = (UserService, user) => async (password) => {
  user.password = password;
  if (user.username === seedOptions.seedAdmin.username && process.env.NODE_ENV === 'production' && await UserService.get(user)) return new AppError(`Failed due to local account already exists: ${user.username}`);
  if (process.env.NODE_ENV === 'test' && await UserService.get(user)) UserService.delete(user);
  try {
    const result = await UserService.create(user);
    if (seedOptions.logResults) console.log(chalk.bold.red(`Database Seeding:\t\t\tLocal ${user.username} added with password set to ${password}`));
    return result;
  } catch (err) {
    throw new AppError('Failed to seedTheUser');
  }
};

module.exports.start = async (options, UserService) => {
  let pwd;
  const result = [];

  // Check for provided options
  seedOptions = _.clone(config.seedDB.options, true);
  if (_.has(options, 'logResults')) seedOptions.logResults = options.logResults;
  if (_.has(options, 'seedUser')) seedOptions.seedUser = options.seedUser;
  if (_.has(options, 'seedAdmin')) seedOptions.seedAdmin = options.seedAdmin;

  try {
    if (process.env.NODE_ENV === 'production') {
      pwd = await UserService.generateRandomPassphrase();
      result.push(await seedTheUser(UserService, seedOptions.seedAdmin)(pwd));
    } else {
      pwd = await UserService.generateRandomPassphrase();
      result.push(await seedTheUser(UserService, seedOptions.seedUser)(pwd));
      pwd = await UserService.generateRandomPassphrase();
      result.push(await seedTheUser(UserService, seedOptions.seedAdmin)(pwd));
    }
  } catch (err) {
    console.log(err);
    return new AppError('Error on seed start');
  }

  return result;
};
