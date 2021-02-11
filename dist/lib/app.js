"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdown = exports.start = exports.bootstrap = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const http_1 = tslib_1.__importDefault(require("http"));
const https_1 = tslib_1.__importDefault(require("https"));
const config_1 = tslib_1.__importDefault(require("../config"));
const express_1 = require("./services/express");
const mongoose_1 = require("./services/mongoose");
const multer_1 = require("./services/multer");
// Establish an SQL server connection, instantiating all models and schemas
// const startSequelize = (): Promise<void> => new Promise(((resolve, reject) => {
//   let orm = {};
//   if (config.orm) {
//     try {
//       orm = require('./services/sequelize');
//       orm.sync().then(() => {
//         resolve(orm);
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e);
//     }
//   } else {
//     resolve();
//   }
// }));
// Establish a MongoDB connection, instantiating all models
const startMongoose = async () => {
    try {
        await mongoose_1.loadModels();
        const dbConnection = await mongoose_1.connect();
        await multer_1.storage();
        return dbConnection;
    }
    catch (e) {
        throw new Error(e);
    }
};
/**
 * Establish ExpressJS powered web server
 * @return {object} app
 */
const startExpress = async () => {
    try {
        return express_1.init();
    }
    catch (e) {
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
    // try {
    //   orm = await startSequelize();
    // } catch (e) {
    //   orm = {};
    // }
    try {
        db = await startMongoose();
        app = await startExpress();
    }
    catch (e) {
        throw new Error(`unable to initialize Mongoose or ExpressJS : ${e}`);
    }
    return {
        db,
        orm,
        app,
    };
};
exports.bootstrap = bootstrap;
/**
 * log server configuration
 */
const logConfiguration = () => {
    // Create server URL
    const server = `${(config_1.default.secure && config_1.default.secure.credentials ? 'https://' : 'http://') + config_1.default.api.host}:${config_1.default.api.port}`;
    // Logging initialization
    console.log(chalk_1.default.green(config_1.default.app.title));
    console.log();
    console.log(chalk_1.default.green(`Environment:     ${process.env.NODE_ENV ? process.env.NODE_ENV : 'develoment'}`));
    console.log(chalk_1.default.green(`Server:          ${server}`));
    console.log(chalk_1.default.green(`Database:        ${config_1.default.db.uri}`));
    if (config_1.default.cors.origin.length > 0)
        console.log(chalk_1.default.green(`Cors:            ${config_1.default.cors.origin}`));
};
// Boot up the server
async function start() {
    let db;
    let orm;
    let app;
    let http;
    try {
        ({ db, orm, app } = await bootstrap());
    }
    catch (e) {
        throw new Error(e);
    }
    try {
        if (config_1.default.secure && config_1.default.secure.credentials)
            http = await https_1.default.createServer(config_1.default.secure.credentials, app).setTimeout(config_1.default.api.timeout).listen(config_1.default.api.port, config_1.default.api.host);
        else
            http = await http_1.default.createServer(app).setTimeout(config_1.default.api.timeout).listen(config_1.default.api.port, config_1.default.api.host);
        logConfiguration();
        return {
            db,
            orm,
            app,
            http,
        };
    }
    catch (e) {
        throw new Error(e);
    }
}
exports.start = start;
// Shut down the server
const shutdown = async (server) => {
    try {
        server.then(async (value) => {
            await mongoose_1.disconnect();
            // add sequelize
            value.http.close((err) => {
                console.info(chalk_1.default.yellow('Server closed'));
                if (err) {
                    console.info(chalk_1.default.red('Error on server close.', err));
                    process.exitCode = 1;
                }
                process.exit();
            });
        });
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.shutdown = shutdown;
//# sourceMappingURL=app.js.map