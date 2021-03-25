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
  if (user.email === seedOptions.seedAdmin.email && process.env.NODE_ENV === 'production' && (await UserService.get(user)))
    return new AppError(`Failed due to local account already exists: ${user.email}`);
  if (process.env.NODE_ENV === 'test' && (await UserService.get(user))) UserService.delete(user);
  try {
    const result = await UserService.create(user);
    if (seedOptions.logResults) console.log(chalk.bold.red(`Database Seeding:\t\t\tLocal ${user.email} added with password set to ${password}`));
    return result;
  } catch (err) {
    throw new AppError('Failed to seedTheUser.', { code: 'LIB_ERROR' });
  }
};

// save the specified user with the password provided from the resolved promise
const seedTasks = async (TaskService, task, user) => {
  try {
    const result = await TaskService.create(task, user);
    if (seedOptions.logResults) console.log(chalk.bold.red(`Database Seeding:\t\t\tLocal ${task.title} added`));
    return result;
  } catch (err) {
    throw new AppError('Failed to seedTasks.', { code: 'LIB_ERROR' });
  }
};

module.exports.start = async (options, UserService, AuthService, TaskService) => {
  let pwd;
  const result = [];

  // Check for provided options
  seedOptions = _.clone(config.seedDB.options, true);
  if (_.has(options, 'logResults')) seedOptions.logResults = options.logResults;
  if (_.has(options, 'seedUser')) seedOptions.seedUser = options.seedUser;
  if (_.has(options, 'seedAdmin')) seedOptions.seedAdmin = options.seedAdmin;
  if (_.has(options, 'seedTasks')) seedOptions.seedTasks = options.seedTasks;

  try {
    if (process.env.NODE_ENV === 'production') {
      pwd = await AuthService.generateRandomPassphrase();
      result.push(await seedTheUser(UserService, seedOptions.seedAdmin)(pwd));
    } else {
      pwd = await AuthService.generateRandomPassphrase();
      result.push(await seedTheUser(UserService, seedOptions.seedUser)(pwd));
      pwd = await AuthService.generateRandomPassphrase();
      result.push(await seedTheUser(UserService, seedOptions.seedAdmin)(pwd));

      if (process.env.NODE_ENV === 'development') {
        result.push(await seedTasks(TaskService, seedOptions.seedTasks[0], result[0]));
        result.push(await seedTasks(TaskService, seedOptions.seedTasks[1], result[1]));
      }
    }
  } catch (err) {
    console.log(err);
    return new AppError('Error on seed start.');
  }

  return result;
};

module.exports.user = async (user, UserService, AuthService) => {
  let pwd;
  const result = [];

  // Check for provided options
  seedOptions = _.clone(config.seedDB.options, true);

  try {
    pwd = await AuthService.generateRandomPassphrase();
    result.push(await seedTheUser(UserService, user)(pwd));
  } catch (err) {
    console.log(err);
    return new AppError('Error on seed start.');
  }

  return result;
};
