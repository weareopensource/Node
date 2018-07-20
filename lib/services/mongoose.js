

/**
 * Module dependencies.
 */
const config = require('../../config'),
  chalk = require('chalk'),
  path = require('path'),
  mongoose = require('mongoose'),
  seed = require('./seed');

/**
 * Load all mongoose related models
 */
module.exports.loadModels = function () {
  return new Promise(((resolve, reject) => {
    // Globbing model files
    config.files.mongooseModels.forEach((modelPath) => {
      require(path.resolve(modelPath));
    });

    resolve();
  }));
};

/**
 * seed the database with default data
 * @param {object} dbConnection the mongoose connection
 */
module.exports.seed = function (dbConnection) {
  return new Promise(((resolve, reject) => {
    if (!dbConnection) {
      reject(new Error('dbConnection parameter is falsey'));
    }

    dbConnection.connection.db.dropDatabase((error, result) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  }));
};

/**
 * Connect to the MongoDB server
 */
module.exports.connect = function () {
  return new Promise(((resolve, reject) => {
    // Attach Node.js native Promises library implementation to Mongoose
    mongoose.Promise = config.db.promise;

    // Requires as of 4.11.0 to opt-in to the new connect implementation
    // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
    const mongoOptions = config.db.options;

    mongoose.connect(config.db.uri, mongoOptions)
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
  }));
};

/**
 * Disconnect from the MongoDB server
 */
module.exports.disconnect = function () {
  return new Promise(((resolve, reject) => {
    mongoose.disconnect((err) => {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      if (err) {
        reject(err);
      }
      resolve();
    });
  }));
};
