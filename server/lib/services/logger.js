'use strict';

const _ = require('lodash');
const config = require('../config');
const fs = require('fs');
const winston = require('winston');
const winstonExpress = require('express-winston');

// maintain variables for singleton
let logger;
let loggerExpress;

module.exports = class Logger {
  static log() {
    if (logger) {
      return logger;
    }

    // Instantiating the default winston application logger with the Console transport
    logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          colorize: true,
          showLevel: true,
          handleExceptions: true,
          humanReadableUnhandledException: true
        })
      ],
      exitOnError: false
    });

    /**
     * Instantiate a winston's File transport for disk file logging
     */
    const fileLoggerTransport = this.setupFileLogger();
    fileLoggerTransport && logger.add(winston.transports.File, fileLoggerTransport);

    return logger;
  }

  /**
   * The options to use with winston logger
   *
   * Returns a Winston object for logging with the File transport
   */
  static setupFileLogger() {
    const _config = _.clone(config, true);
    const configFileLogger = _config.log.fileLogger;

    if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
      console.log('unable to find logging file configuration');
      return false;
    }

    const logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;

    // instantiate the file logging transport
    if (!fs.openSync(logPath, 'a+')) {
      throw new Error('unable to instantiate file logging path');
    }

    return {
      level: 'debug',
      colorize: false,
      filename: logPath,
      timestamp: true,
      maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
      maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
      json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
      eol: '\n',
      tailable: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    };
  }

  /**
   * use with express logger
   */
  static logExpress() {
    if (loggerExpress) {
      return loggerExpress;
    }

    loggerExpress = winstonExpress.logger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          json: false,
          colorize: true
        })
      ],
      meta: true,
      expressFormat: true,
      colorize: true
    });

    return loggerExpress;
  }
}
