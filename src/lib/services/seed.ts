/**
 * Module dependencies.
 */
import _ from 'lodash';
import chalk from 'chalk';
import config from '../../config';
import AppError from '../helpers/AppError';
import * as UserService from '../../modules/users/services/user.service';
import * as AuthService from '../../modules/auth/services/auth.service';
import * as TaskService from '../../modules/tasks/services/tasks.service';

// global seed options object
let seedOptions: any = {};

// save the specified user with the password provided from the resolved promise
const seedTheUser = (user) => async (password) => {
  user.password = password;
  if (user.email === seedOptions.seedAdmin.email && process.env.NODE_ENV === 'production' && await UserService.get(user)) return new AppError(`Failed due to local account already exists: ${user.email}`);
  if (process.env.NODE_ENV === 'test' && await UserService.get(user)) await UserService.deleteUser(user);
  try {
    const result = await UserService.create(user);
    if (seedOptions.logResults) console.log(chalk.bold.red(`Database Seeding:\t\t\tLocal ${user.email} added with password set to ${password}`));
    return result;
  } catch (err) {
    throw new AppError('Failed to seedTheUser.', { code: 'LIB_ERROR' });
  }
};


// save the specified user with the password provided from the resolved promise
const seedTasks = async (task, user: any) => {
  try {
    const result = await TaskService.create(task, user);
    if (seedOptions.logResults) console.log(chalk.bold.red(`Database Seeding:\t\t\tLocal ${task.title} added`));
    return result;
  } catch (err) {
    throw new AppError('Failed to seedTasks.', { code: 'LIB_ERROR' });
  }
};

export async function start(options) {
  let pwd;
  const result: any[] = [];

  // Check for provided options
  seedOptions = _.clone(config.seedDB.options);
  if (_.has(options, 'logResults')) seedOptions.logResults = options.logResults;
  if (_.has(options, 'seedUser')) seedOptions.seedUser = options.seedUser;
  if (_.has(options, 'seedAdmin')) seedOptions.seedAdmin = options.seedAdmin;
  if (_.has(options, 'seedTasks')) seedOptions.seedTasks = options.seedTasks;

  try {
    if (process.env.NODE_ENV === 'production') {
      pwd = await AuthService.generateRandomPassphrase();
      result.push(await seedTheUser(seedOptions.seedAdmin)(pwd));
    } else {
      pwd = await AuthService.generateRandomPassphrase();
      result.push(await seedTheUser(seedOptions.seedUser)(pwd));
      pwd = await AuthService.generateRandomPassphrase();
      result.push(await seedTheUser(seedOptions.seedAdmin)(pwd));

      if (process.env.NODE_ENV === 'development') {
        result.push(await seedTasks(seedOptions.seedTasks[0], result[0]));
        result.push(await seedTasks(seedOptions.seedTasks[1], result[1]));
      }
    }
  } catch (err) {
    console.log(err);
    return new AppError('Error on seed start.');
  }

  return result;
}

export async function userSeed(user: any) {
  let pwd;
  const result: any = [];

  // Check for provided options
  seedOptions = _.clone(config.seedDB.options);

  try {
    pwd = await AuthService.generateRandomPassphrase();
    result.push(await seedTheUser(user)(pwd));
  } catch (err) {
    console.log(err);
    return new AppError('Error on seed start.');
  }

  return result;
}
