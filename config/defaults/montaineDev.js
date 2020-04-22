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
  jwt: {
    secret: 'MontaineNodeDevSecret', // secret for hash
    expiresIn: 7 * 24 * 60 * 60, // token expire in x sec
  },
  jwtLou: {
    secret: 'LouNodeDevSecret', // secret for hash
    expiresIn: 360, // token expire in x sec
  },
  mailer: {
    from: 'lou.worker@gmail.com',
    options: {
      service: 'gmail',
      auth: {
        user: 'lou.worker@gmail.com',
        pass: 'zmvhmfqjzuzftpth',
      },
    },
  },
});
