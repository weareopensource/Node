const _ = require('lodash');
const chalk = require('chalk');
const fs = require('fs');
const winston = require('winston');
const config = require('../../config');

// list of valid formats for the logging
const validFormats = ['combined', 'common', 'dev', 'short', 'tiny', 'custom'];

// Instantiating the default winston application logger with the Console
// transport

/* eslint new-cap: 0 */
const logger = new winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
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
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      logger.add(new winston.transports.File(fileLoggerTransport));
    }

    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.red('An error has occurred during the creation of the File transport logger.'));
      console.log(chalk.red(err));
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
  const _config = _.clone(config, true);
  const configFileLogger = _config.log.fileLogger;

  if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
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
    json: _.has(configFileLogger, 'json') ? configFileLogger.json : false,
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
  const conf = config.log && config.log.format ? config.log.format.toString() : 'combined';
  let format;

  // make sure we have a valid format
  if (!_.includes(validFormats, conf)) format = 'combined';
  else if (conf === 'custom') format = config.log.pattern;
  else format = conf;

  return format;
};

logger.setupFileLogger();

module.exports = logger;
