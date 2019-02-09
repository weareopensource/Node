const _ = require('lodash');
const defaultConfig = require('./development');

module.exports = _.merge(defaultConfig, {
  host: '0.0.0.0',
  db: {
    uri: 'mongodb://localhost/WaosNode',
    debug: false,
  },
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt',
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
  },
  cors: {
    url: 'http://localhost:3000',
  },
  livereload: false,
});
