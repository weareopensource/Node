/**
 * Module dependencies.
 */

const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../../config');

/**
 * Load all mongoose related models
 */
module.exports.loadModels = async (callback) => {
  // Globbing model files
  await Promise.all(config.files.mongooseModels.map(async (modelPath) => {
    await require(path.resolve(modelPath));
  }));
  if (callback) callback();
};

/**
 * Connect to the MongoDB server
 */
module.exports.connect = async () => {
  try {
  // Attach Node.js native Promises library implementation to Mongoose
    mongoose.Promise = Promise;
    // Requires as of 4.11.0 to opt-in to the new connect implementation
    // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
    const mongoOptions = config.db.options;

    if (mongoOptions.sslCA) mongoOptions.sslCA = fs.readFileSync(mongoOptions.sslCA);
    if (mongoOptions.sslCert) mongoOptions.sslCert = fs.readFileSync(mongoOptions.sslCert);
    if (mongoOptions.sslKey) mongoOptions.sslKey = fs.readFileSync(mongoOptions.sslKey);

    await mongoose.connect(config.db.uri, mongoOptions);
    mongoose.set('debug', config.db.debug);

    return mongoose;
  } catch (err) {
  // Log Error
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(err);
    throw err;
  }
};

/**
 * Disconnect from the MongoDB server
 */
module.exports.disconnect = async () => {
  await mongoose.disconnect();
  console.info(chalk.yellow('Disconnected from MongoDB.'));
};
