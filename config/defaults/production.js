'use strict';

var fs = require('fs');

module.exports = {
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
  port: 8443,
  host: '127.0.0.1',
  livereload: false
};
