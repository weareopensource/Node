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
    restoreExceptions: ['histories'],
  },
  cors: {
    origin: ['http://localhost:8011'],
  },
  repos: [{ // generate releases and changelogs list auto /api/core/changelogs /api/core/releases
    title: 'Server',
    owner: 'PierreBrisorgueil',
    repo: 'montaine_node',
    changelog: 'CHANGELOG.md',
    token: null,
  }, {
    title: 'Web',
    owner: 'PierreBrisorgueil',
    repo: 'montaine_vue',
    changelog: 'CHANGELOG.md',
    token: null,
  }],
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
        user: 'montaine.worker@gmail.com',
        pass: 'pyicsdyqmfooayby',
      },
    },
  },
});
