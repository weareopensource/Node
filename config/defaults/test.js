const _ = require('lodash');
const defaultConfig = require('./development');

module.exports = _.merge(defaultConfig, {
  app: {
    title: 'WeAreOpenSource Node - Test Environment',
  },
  port: 3001,
  host: 'localhost',
  db: {
    uri: 'mongodb://localhost/WaosNodeTest',
    debug: false,
  },
  livereload: false,
});
