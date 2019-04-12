/**
 * Module dependencies.
 */
const chalk = require('chalk');
const http = require('http');
const https = require('https');

const config = require('../config');
const mongooseService = require('./services/mongoose');
const express = require('./services/express');

// Establish an SQL server connection, instantiating all models and schemas
const startSequelize = () => new Promise(((resolve, reject) => {
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

// Establish a MongoDB connection, instantiating all models
const startMongoose = () => {
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
};

/**
 * Establish ExpressJS powered web server
 * @return {object} app
 */
const startExpress = () => new Promise(((resolve, reject) => {
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


/**
 * Bootstrap the required services
 * @return {Object} db, orm, and app instances
 */
const bootstrap = () => new Promise((async (resolve, reject) => {
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
// Expose the boostrap function publically
exports.bootstrap = bootstrap;

/**
 * log server configuration
 */
const logConfiguration = () => {
  // Create server URL
  const server = `${(config.secure && config.secure.credentials ? 'https://' : 'http://') + config.host}:${config.port}`;
  // Logging initialization
  console.log(chalk.green(config.app.title));
  console.log();
  console.log(chalk.green(`Environment:     ${process.env.NODE_ENV ? process.env.NODE_ENV : 'develoment'}`));
  console.log(chalk.green(`Server:          ${server}`));
  console.log(chalk.green(`Database:        ${config.db.uri}`));
};

// Boot up the server
exports.start = () => new Promise((async (resolve, reject) => {
  let db;
  let orm;
  let app;

  try {
    ({ db, orm, app } = await bootstrap());
  } catch (e) {
    return reject(e);
  }

  try {
    if (config.secure && config.secure.credentials) await https.createServer(config.secure.credentials, app).listen(config.port, config.host);
    else await http.createServer(app).listen(config.port, config.host);
    logConfiguration();
    return resolve({
      db,
      orm,
      app,
    });
  } catch (e) {
    return reject(e);
  }
}));
