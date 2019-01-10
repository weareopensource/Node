/**
 * Module dependencies.
 */
const config = require('../config');
const mongooseService = require('./services/mongoose');
const express = require('./services/express');
const chalk = require('chalk');

// Establish an SQL server connection, instantiating all models and schemas
function startSequelize() {
  return new Promise(((resolve, reject) => {
    let orm = {};
    if (config.orm) {
      try {
        orm = require('./services/sequelize');
        orm.sync().then(() => {
          resolve(orm);
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    } else {
      resolve();
    }
  }));
}

// Establish a MongoDB connection, instantiating all models
function startMongoose() {
  mongooseService.loadModels();
  return new Promise(((resolve, reject) => {
    mongooseService.connect()
      .then((dbConnection) => {
        resolve(dbConnection);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  }));
}

/**
 * Establish ExpressJS powered web server
 * @param {object} db a Mongoose DB
 * @param {object} orm an SQL DB
 */
function startExpress() {
  return new Promise(((resolve, reject) => {
    // Initialize the ExpressJS web application server
    let app;
    try {
      app = express.init();
    } catch (e) {
      console.log(e);
      return reject(e);
    }

    return resolve(app);
  }));
}


/**
 * Bootstrap the required services
 * @returns {Object} db, orm, and app instances
 */
function bootstrap() {
  return new Promise((async (resolve, reject) => {
    let orm;
    let db;
    let app;

    try {
      orm = await startSequelize();
    } catch (e) {
      orm = {};
    }

    try {
      db = await startMongoose();
      app = await startExpress();
    } catch (e) {
      return reject(new Error('unable to initialize Mongoose or ExpressJS'));
    }

    return resolve({
      db,
      orm,
      app,
    });
  }));
}


// Expose the boostrap function publically
exports.bootstrap = bootstrap;

// Boot up the server
exports.start = function start() {
  return new Promise((async (resolve, reject) => {
    let db;
    let orm;
    let app;

    try {
      ({ db, orm, app } = await bootstrap());
    } catch (e) {
      return reject(e);
    }

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, () => {
      // Create server URL
      const server = `${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host}:${config.port}`;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green(`Environment:     ${process.env.NODE_ENV}`));
      console.log(chalk.green(`Server:          ${server}`));
      console.log(chalk.green(`Database:        ${config.db.uri}`));
      console.log(chalk.green(`App version:     ${config.meanjs.version}`));

      if (config.meanjs['meanjs-version']) {
        console.log(chalk.green(`MEAN.JS version: ${config.meanjs['meanjs-version']}`));
      }

      console.log('--');

      return resolve({
        db,
        orm,
        app,
      });
    });
  }));
};
