'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./services/mongoose'),
  express = require('./services/express'),
  chalk = require('chalk');

// Establish an SQL server connection, instantiating all models and schemas
function startSequelize() {
  return new Promise(function (resolve, reject) {
    let orm = {};
    if (config.orm) {
      try {
        orm = require('./services/sequelize');
        orm.sync().then(function () {
            resolve(orm);
          });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    } else {
      resolve();
    }
  });
}

// Establish a MongoDB connection, instantiating all models
function startMongoose() {
  return new Promise(function (resolve, reject) {
    mongoose.loadModels()
      .then(mongoose.connect)
      .then(function(dbConnection) {
        resolve(dbConnection);
      })
      .catch(function(e) {
        console.log(e);
        reject(e);
      });
  });
}

/**
 * Establish ExpressJS powered web server
 * @param {object} db a Mongoose DB
 * @param {object} orm an SQL DB
 */
function startExpress() {
  return new Promise(function (resolve, reject) {

    // Initialize the ExpressJS web application server
    let app;
    try {
      app = express.init();
    } catch(e) {
      console.log(e);
      return reject(e);
    }

    return resolve(app);
  });
}


/**
 * Bootstrap the required services
 * @returns {Object} db, orm, and app instances
 */
function bootstrap () {
  return new Promise(async function (resolve, reject) {
    let orm, db, app;

    try {
      orm  = await startSequelize();
    }  catch (e) {
      orm = {};
    }

    try {
      db = await startMongoose();
      app = await startExpress();
    } catch (e) {
      return reject(new Error('unable to initialize Mongoose or ExpressJS'));
    }

    return resolve({
      db: db,
      orm: orm,
      app: app
    });

  });
};


// Expose the boostrap function publically
exports.bootstrap = bootstrap;

// Boot up the server
exports.start = function start() {
  return new Promise(async function (resolve, reject) {

    let db, orm, app;

    try {
      ({db, orm, app} = await bootstrap());
    } catch (e) {
      return reject(e);
    }

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:        ' + config.db.uri));
      console.log(chalk.green('App version:     ' + config.meanjs.version));

      if (config.meanjs['meanjs-version']) {
        console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
      }

      console.log('--');

      return resolve({
        db: db,
        orm: orm,
        app: app
      });

    });

  });
};
