/**
 * Module dependencies.
 */

import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import mongoose from 'mongoose';
import config from '../../config';

/**
 * Load all mongoose related models
 */
export function loadModels(callback?: () => void) {
  // Globbing model files
  config.files.mongooseModels.forEach((modelPath: string) => {
    import(path.resolve(modelPath));
  });
  if (callback) callback();
}

/**
 * Connect to the MongoDB server
 */
export const connect = async (): Promise<mongoose.Mongoose> => {
  try {
    // Attach Node.js native Promises library implementation to Mongoose
    mongoose.Promise = config.db.promise;
    // Requires as of 4.11.0 to opt-in to the new connect implementation
    // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
    const mongoOptions = config.db.options;

    if (mongoOptions.sslCA) mongoOptions.sslCA = fs.readFileSync(mongoOptions.sslCA);
    if (mongoOptions.sslCert) mongoOptions.sslCert = fs.readFileSync(mongoOptions.sslCert);
    if (mongoOptions.sslKey) mongoOptions.sslKey = fs.readFileSync(mongoOptions.sslKey);

    await mongoose.connect(config.db.uri, mongoOptions as any);

    // Enabling mongoose debug mode if required
    mongoose.set('debug', config.db.debug);
    return mongoose;
  } catch (err) {
    // Log Error
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(err);
    throw err;
  }
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  console.info(chalk.yellow('Disconnected from MongoDB.'));
};
