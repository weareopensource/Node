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
module.exports.loadModels = (callback) => {
  // Globbing model files
  config.files.mongooseModels.forEach((modelPath) => {
    require(path.resolve(modelPath));
  });
  if (callback) callback();
};

/**
 * Connect to the MongoDB server
 */
module.exports.connect = () => new Promise((resolve, reject) => {
  // Attach Node.js native Promises library implementation to Mongoose
  mongoose.Promise = config.db.promise;
  // Requires as of 4.11.0 to opt-in to the new connect implementation
  // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
  const mongoOptions = config.db.options;

  if (mongoOptions.sslCA) mongoOptions.sslCA = fs.readFileSync(mongoOptions.sslCA);
  if (mongoOptions.sslCert) mongoOptions.sslCert = fs.readFileSync(mongoOptions.sslCert);
  if (mongoOptions.sslKey) mongoOptions.sslKey = fs.readFileSync(mongoOptions.sslKey);

  return mongoose
    .connect(config.db.uri, mongoOptions)
    .then(() => {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Resolve a successful connection with the mongoose object for the
      // default connection handler
      resolve(mongoose);
    })
    .catch((err) => {
      // Log Error
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
      reject(err);
    });
});

/**
 * Disconnect from the MongoDB server
 */
module.exports.disconnect = () => new Promise((resolve, reject) => {
  mongoose.disconnect((err) => {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    if (err) reject(err);
    resolve();
  });
});
