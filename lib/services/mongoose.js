/**
 * Module dependencies.
 */

import chalk from "chalk";
import mongoose from "mongoose";
import path from "path"

import config from "../../config/index.js"

/**
 * Load all mongoose related models
 */
const loadModels = async (callback) => {
  // Globbing model files
  await Promise.all(
    config.files.mongooseModels.map(async (modelPath) => {
      await import(path.resolve(modelPath));
    }),
  );

  if (callback) callback();
};

/**
 * Connect to the MongoDB server
 */
 const connect = async () => {
  try {
    // Attach Node.js native Promises library implementation to Mongoose
    mongoose.Promise = Promise;
    // Requires as of 4.11.0 to opt-in to the new connect implementation
    // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
    const mongoOptions = config.db.options;

    if (mongoOptions.sslCA) mongoOptions.sslCA = path.resolve(mongoOptions.sslCA);
    if (mongoOptions.sslCert) mongoOptions.sslCert = path.resolve(mongoOptions.sslCert);
    if (mongoOptions.sslKey) mongoOptions.sslKey = path.resolve(mongoOptions.sslKey);

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
 const disconnect = async () => {
  await mongoose.disconnect();
  console.info(chalk.yellow('Disconnected from MongoDB.'));
};


export default {
  loadModels,
  connect,
  disconnect
}