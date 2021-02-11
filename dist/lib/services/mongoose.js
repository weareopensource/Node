"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = exports.loadModels = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = tslib_1.__importDefault(require("path"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const config_1 = tslib_1.__importDefault(require("../../config"));
/**
 * Load all mongoose related models
 */
function loadModels(callback) {
    // Globbing model files
    config_1.default.files.mongooseModels.forEach((modelPath) => {
        Promise.resolve().then(() => tslib_1.__importStar(require(path_1.default.resolve(modelPath))));
    });
    if (callback)
        callback();
}
exports.loadModels = loadModels;
/**
 * Connect to the MongoDB server
 */
const connect = async () => {
    try {
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
        await mongoose_1.default.connect(config_1.default.db.uri, mongoOptions);
        // Enabling mongoose debug mode if required
        mongoose_1.default.set('debug', config_1.default.db.debug);
        return mongoose_1.default;
    }
    catch (err) {
        // Log Error
        console.error(chalk_1.default.red('Could not connect to MongoDB!'));
        console.log(err);
        throw err;
    }
};
exports.connect = connect;
const disconnect = async () => {
    await mongoose_1.default.disconnect();
    console.info(chalk_1.default.yellow('Disconnected from MongoDB.'));
};
exports.disconnect = disconnect;
//# sourceMappingURL=mongoose.js.map