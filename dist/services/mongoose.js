"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const config_1 = tslib_1.__importDefault(require("../../config"));
/**
 * Load all mongoose related models
 */
module.exports.loadModels = (callback) => {
    // Globbing model files
    config_1.default.files.mongooseModels.forEach((modelPath) => {
        require(path_1.default.resolve(modelPath));
    });
    if (callback)
        callback();
};
/**
 * Connect to the MongoDB server
 */
module.exports.connect = () => new Promise((resolve, reject) => {
    // Attach Node.js native Promises library implementation to Mongoose
    mongoose_1.default.Promise = config_1.default.db.promise;
    // Requires as of 4.11.0 to opt-in to the new connect implementation
    // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
    const mongoOptions = config_1.default.db.options;
    if (mongoOptions.sslCA)
        mongoOptions.sslCA = fs_1.default.readFileSync(mongoOptions.sslCA);
    if (mongoOptions.sslCert)
        mongoOptions.sslCert = fs_1.default.readFileSync(mongoOptions.sslCert);
    if (mongoOptions.sslKey)
        mongoOptions.sslKey = fs_1.default.readFileSync(mongoOptions.sslKey);
    return mongoose_1.default
        .connect(config_1.default.db.uri, mongoOptions)
        .then(() => {
        // Enabling mongoose debug mode if required
        mongoose_1.default.set('debug', config_1.default.db.debug);
        // Resolve a successful connection with the mongoose object for the
        // default connection handler
        resolve(mongoose_1.default);
    })
        .catch((err) => {
        // Log Error
        console.error(chalk_1.default.red('Could not connect to MongoDB!'));
        console.log(err);
        reject(err);
    });
});
/**
 * Disconnect from the MongoDB server
 */
module.exports.disconnect = () => new Promise((resolve, reject) => {
    mongoose_1.default.disconnect((err) => {
        console.info(chalk_1.default.yellow('Disconnected from MongoDB.'));
        if (err)
            reject(err);
        resolve();
    });
});
//# sourceMappingURL=mongoose.js.map