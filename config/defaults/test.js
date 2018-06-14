'use strict';

var defaultConfig = require('./common');

module.exports = {
  app: {
    title: defaultConfig.app.title + ' - Test Environment'
  },
  db: {
    uri: 'mongodb://localhost/mean-test',
    // Enable mongoose debug mode
    debug: false
  },
  secure: {
    ssl: false,
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev'
  },
  port: 3001
  host: 'localhost',
  livereload: false
};
