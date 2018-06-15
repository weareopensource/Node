'use strict';

var defaultConfig = require('./common');

module.exports = {
  app: {
    title: defaultConfig.app.title + ' - Development Environment',
  },
  db: {
    uri: defaultConfig.db.uri + '-dev',
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
