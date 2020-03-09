const _ = require('lodash');
const defaultConfig = require('./development');

module.exports = _.merge(defaultConfig, {
  app: {
    title: 'Montaine Node (Dev Environment)',
    contact: 'brisorgueilp@gmail.com',
  },
  port: 3011,
  db: {
    uri: 'mongodb://localhost/MontaineNodeDev',
    debug: false,
  },
  cors: {
    origin: ['http://localhost:8011'],
  },
});
