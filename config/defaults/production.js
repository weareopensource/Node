'use strict';

const _ = require('lodash'),
  defaultConfig = require('./development');

module.exports = _.merge(defaultConfig, {
  app: {
    title: 'MEAN.JS'
  },
  db: {
    uri: 'mongodb://localhost/riess',
    debug: false
  },
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined'
  },
  cors: {
    url: 'http://localhost:3000'
  },
  livereload: false
});
