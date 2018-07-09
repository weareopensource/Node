const _ = require('lodash');
const defaultConfig = require('./development');

module.exports = _.merge(defaultConfig, {
  app: {
    title: 'MEAN.JS - Test Environment',
  },
  db: {
    uri: 'mongodb://localhost/mean-test',
    debug: false,
  },
  livereload: false,
});
