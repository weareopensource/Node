"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const winston_1 = tslib_1.__importDefault(require("winston"));
const config_1 = tslib_1.__importDefault(require("../../config"));
// list of valid formats for the logging
const validFormats = ['combined', 'common', 'dev', 'short', 'tiny', 'custom'];
// Instantiating the default winston application logger with the Console
// transport
// @ts-ignore
// eslint-disable-next-line new-cap
const logger = new winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            level: 'info',
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});
// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan's stream
// option to log all HTTP requests to a file
logger.stream = {
    write(msg) {
        logger.info(msg);
    },
};
/**
 * Instantiate a winston's File transport for disk file logging
 *
 */
logger.setupFileLogger = function setupFileLogger() {
    const fileLoggerTransport = this.getLogOptions();
    if (!fileLoggerTransport) {
        return false;
    }
    try {
        // Check first if the configured path is writable and only then
        // instantiate the file logging transport
        if (fs_1.default.openSync(fileLoggerTransport.filename, 'a+')) {
            logger.add(new winston_1.default.transports.File(fileLoggerTransport));
        }
        return true;
    }
    catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.log();
            console.log(chalk_1.default.red('An error has occurred during the creation of the File transport logger.'));
            console.log(chalk_1.default.red(err));
            console.log();
        }
        return false;
    }
};
/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
logger.getLogOptions = function getLogOptions() {
    const configClone = lodash_1.default.clone(config_1.default);
    const configFileLogger = configClone.log.fileLogger;
    if (!lodash_1.default.has(configClone, 'log.fileLogger.directoryPath') || !lodash_1.default.has(configClone, 'log.fileLogger.fileName')) {
        console.log('unable to find logging file configuration');
        return false;
    }
    const logPath = `${configFileLogger.directoryPath}/${configFileLogger.fileName}`;
    return {
        level: 'debug',
        colorize: false,
        filename: logPath,
        timestamp: true,
        maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
        maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
        json: (lodash_1.default.has(configFileLogger, 'json')) ? configFileLogger.json : false,
        eol: '\n',
        tailable: true,
        showLevel: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
    };
};
/**
 * The options to use with morgan logger
 *
 * Returns a log.options object with a writable stream based on winston
 * file logging transport (if available)
 */
logger.getMorganOptions = function getMorganOptions() {
    return {
        stream: logger.stream,
    };
};
/**
 * The format to use with the logger
 *
 * Returns the log.format option set in the current environment configuration
 */
logger.getLogFormat = function getLogFormat() {
    const conf = config_1.default.log && config_1.default.log.format ? config_1.default.log.format.toString() : 'combined';
    let format;
    // make sure we have a valid format
    if (!lodash_1.default.includes(validFormats, conf))
        format = 'combined';
    else if (conf === 'custom')
        format = config_1.default.log.pattern;
    else
        format = conf;
    return format;
};
logger.setupFileLogger();
exports.default = logger;
//# sourceMappingURL=logger.js.map