/**
 * Module dependencies.
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');

const mongooseService = require(path.resolve('./lib/services/mongoose'));
const AppError = require(path.resolve('./lib/helpers/AppError'));
const config = require('../../config');

// global seed options object
let seedOptions = {};
let UserService = null;

// const removeUser = async (user) => {
//   try {
//     return await UserService.delete(user);
//   } catch (err) {
//     throw new AppError(`Failed to remove local ${user.username}`);
//   }
// };

const saveUser = async (user) => {
  try {
    return await UserService.create(user);
  } catch (err) {
    throw new AppError(`Failed to add local ${user.username}`);
  }
};

const checkUserNotExists = async (user) => {
  try {
    const result = await UserService.get(user);
    if (result === {}) return {};
    throw new AppError(`Failed due to local account already exists: ${user.username}`);
  } catch (err) {
    throw new AppError(`Failed to find local account ${user.username}`);
  }
};

const reportSuccess = password => async (user) => {
  if (seedOptions.logResults) {
    console.log(chalk.bold.red(`Database Seeding:\t\t\tLocal ${user.username} added with password set to ${password}`));
    return true;
  }
};

// save the specified user with the password provided from the resolved promise
const seedTheUser = user => password => new Promise(((resolve, reject) => {
  // set the new password
  user.password = password;

  if (user.username === seedOptions.seedAdmin.username && process.env.NODE_ENV === 'production') {
    checkUserNotExists(user)
      .then(saveUser(user))
      .then(reportSuccess(password))
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    saveUser(user)
      .then(reportSuccess(password))
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  }
}));

// report the error
const reportError = reject => (err) => {
  if (seedOptions.logResults) {
    console.log();
    console.log(`Database Seeding:\t\t\t${err}`);
    console.log();
  }
  reject(err);
};

module.exports.start = async (options) => {
  try {
    await mongooseService.connect()
      .then(() => {
        mongooseService.loadModels();
        UserService = require(path.resolve('./modules/users/services/user.service'));
      });
  } catch {
    throw new AppError('Error on DB connection');
  }


  // Initialize the default seed options
  seedOptions = _.clone(config.seedDB.options, true);

  // Check for provided options

  if (_.has(options, 'logResults')) seedOptions.logResults = options.logResults;

  if (_.has(options, 'seedUser')) seedOptions.seedUser = options.seedUser;

  if (_.has(options, 'seedAdmin')) seedOptions.seedAdmin = options.seedAdmin;

  await new Promise(((resolve, reject) => {
    // If production only seed admin if it does not exist
    if (process.env.NODE_ENV === 'production') {
      UserService.generateRandomPassphrase()
        .then(seedTheUser(seedOptions.seedAdmin))
        .then(() => {
          resolve();
        })
        .catch(reportError(reject));
    } else {
      // Add both Admin and User account
      UserService.generateRandomPassphrase()
        .then(seedTheUser(seedOptions.seedUser))
        .then(UserService.generateRandomPassphrase)
        .then(seedTheUser(seedOptions.seedAdmin))
        .then(() => {
          resolve();
        })
        .catch(reportError(reject));
    }
  }));

  try {
    return mongooseService.disconnect();
  } catch {
    return new AppError('Error on DB connection');
  }
};
