'use strict';

var defaultConfig = require('./common');

module.exports = {
  app: {
    title: defaultConfig.app.title + ' - Development Environment',
  },
  db: {
    uri: 'mongodb://localhost/riessdev',
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
  port: 3000,
  host: 'localhost',
  livereload: true
};
