'use strict';

module.exports = {
  app: {
    title: 'MEAN.JS - Development Environment',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: 'WAOS_BACK_app_googleAnalyticsTrackingID'
  },
  port: 3000,
  host: 'localhost',
  db: {
    uri: 'mongodb://localhost/riess-dev',
    debug: true,
    options: {
      user: '',
      pass: ''
      /**
        * Uncomment to enable ssl certificate based authentication to mongodb
        * servers. Adjust the settings below for your specific certificate
        * setup.
      server: {
        ssl: true,
        sslValidate: false,
        checkServerIdentity: false,
        sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
        sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
        sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
        sslPass: '1234'
      }
      */
    },
    promise: global.Promise
  },
  secure: {
    ssl: false,
  },
  log: {
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  livereload: true,
  // orm: {
  //    dbname: 'riessdev',
  //    user: '',
  //    pass: '',
  //    options: {
  //      // sequelize supports one of: mysql, postgres, sqlite, mariadb and mssql.
  //      dialect: 'postgres',
  //      host: '',
  //      port: ''
  //    }
  //  },

  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  // secure: {
  //   ssl: true,
  //   privateKey: './config/sslcerts/key.pem',
  //   certificate: './config/sslcerts/cert.pem',
  //   caBundle: './config/sslcerts/cabundle.crt'
  // },

  uploads: {
    profile: {
      image: {
        dest: './uploads',
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  },
  jwt: {
    secret: 'test'
  },
  mailer: {
    from: 'WAOS_BACK_mailer_from',
    options: {
      service: 'WAOS_BACK_mailer_options_service',
      auth: {
        user: 'WAOS_BACK_mailer_options_auth_user',
        pass: 'WAOS_BACK_mailer_options_auth_pass'
      }
    }
  },
  google: {
    clientId: 'WAOS_BACK_google_clientId'
  },
  microsoft: {
    clientId: 'WAOS_BACK_microsoft_clientId',
    issuer: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
    discovery: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
//    issuer: 'WAOS_BACK_microsoft_issuer',
//    discovery: 'WAOS_BACK_microsoft_discovery'
  },
  domain: '',
  seedDB: {
    seed: true,
    options: {
      logResults: true,
      seedUser: {
        username: 'seeduser',
        provider: 'local',
        email: 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: 'seedadmin',
        provider: 'local',
        email: 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
