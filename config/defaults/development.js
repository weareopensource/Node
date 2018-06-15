'use strict';

var defaultConfig = require('./common');

module.exports = {
  app: {
    title: defaultConfig.app.title + ' - Development Environment',
  },
  db: {
    debug: true
  },
  secure: {
    ssl: false,
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev'
  },
  livereload: true
};
