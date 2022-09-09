/**
 * Module dependencies.
 */
import chalk from "chalk";
import nodeHttp from "http";
import nodeHttps from "https";
import path from "path";

import config from "../config/index.js"
import express from "./services/express.js"
import multerService from "./services/multer.js"
import mongooseService from "./services/mongoose.js"

// Establish an SQL server connection, instantiating all models and schemas
const startSequelize = () =>
  new Promise(async (resolve, reject) => {
    let orm = {};
    if (config.orm) {
      try {
        orm = await import(path.resolve('./services/sequelize.js'));
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
  });

// Establish a MongoDB connection, instantiating all models
const startMongoose = async () => {
  try {
    await mongooseService.loadModels();
    const dbConnection = await mongooseService.connect();
    await multerService.storage();
    return dbConnection;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Establish ExpressJS powered web server
 * @return {object} app
 */
const startExpress = async () => {
  try {
    const app = await express.init();
    return app;
  } catch (e) {
    console.log("tototo start", e);
    throw new Error(e);
  }
};

/**
 * Bootstrap the required services
 * @return {Object} db, orm, and app instances
 */
const bootstrap = async () => {
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
    throw new Error(`unable to initialize Mongoose or ExpressJS : ${e}`);
  }

  return {
    db,
    orm,
    app,
  };
};

/**
 * log server configuration
 */
const logConfiguration = () => {
  // Create server URL
  const server = `${(config.secure && config.secure.credentials ? 'https://' : 'http://') + config.api.host}:${config.api.port}`;
  // Logging initialization
  console.log(chalk.green(config.app.title));
  console.log();
  console.log(chalk.green(`Environment:     ${process.env.NODE_ENV ? process.env.NODE_ENV : 'develoment'}`));
  console.log(chalk.green(`Server:          ${server}`));
  console.log(chalk.green(`Database:        ${config.db.uri}`));
  if (config.cors.origin.length > 0) console.log(chalk.green(`Cors:            ${config.cors.origin}`));
};

// Boot up the server
const start = async () => {
  let db;
  let orm;
  let app;
  let http;

  try {
    ({ db, orm, app } = await bootstrap());
  } catch (e) {
    throw new Error(e);
  }

  try {
    if (config.secure && config.secure.credentials)
      http = await nodeHttps.createServer(config.secure.credentials, app).setTimeout(config.api.timeout).listen(config.api.port, config.api.host);
    else http = await nodeHttp.createServer(app).setTimeout(config.api.timeout).listen(config.api.port, config.api.host);
    logConfiguration();
    return {
      db,
      orm,
      app,
      http,
    };
  } catch (e) {
    throw new Error(e);
  }
};

// Shut down the server
const shutdown = async (server) => {
  try {
    server.then(async (value) => {
      await mongooseService.disconnect();
      // add sequelize
      value.http.close((err) => {
        console.info(chalk.yellow('Server closed'));
        if (err) {
          console.info(chalk.red('Error on server close.', err));
          process.exitCode = 1;
        }
        process.exit();
      });
    });
  } catch (e) {
    throw new Error(e);
  }
};

export {
  bootstrap,
  start,
  shutdown
}