module.exports = {
  app: {
    title: 'WeAreOpenSource Node - Development Environment',
    description:
      'Node - Boilerplate Back : Express, Jwt, Mongo, Sequelize (Beta) ',
    keywords: 'node, express, mongo, jwt, sequelize, stack, boilerplate',
    googleAnalyticsTrackingID: 'WAOS_NODE_app_googleAnalyticsTrackingID',
    contact: 'waos.me@gmail.com',
  },
  port: 3000,
  host: 'localhost',
  db: {
    uri: 'mongodb://localhost/WaosNodeDev',
    debug: true,
    options: {
      user: '',
      pass: '',
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      /**
        * Uncomment to enable ssl certificate based authentication to mongodb
        * servers. Adjust the settings below for your specific certificate
        * setup.
      ssl: true,
      sslValidate: false,
      checkServerIdentity: false,
      sslCA: './config/sslcerts/ssl-ca.pem',
      sslCert: './config/sslcerts/ssl-cert.pem',
      sslKey: './config/sslcerts/ssl-key.pem',
      sslPass: '1234'
      */
    },
    promise: global.Promise,
    restoreExceptions: [], // collections exceptions for db restore : npm run seed:mongorestore
  },
  // SSL on express server (FYI : Wiki)
  // secure: {
  //   ssl: false,
  //   key: './config/sslcerts/key.pem',
  //   cert: './config/sslcerts/cert.pem',
  // },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny', 'custom'
    format: 'custom',
    pattern:
      ':id :email :method :url :status :response-time ms - :res[content-length]', // only for custom format
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false,
    },
  },
  livereload: true,
  // orm: {
  //    dbname: 'WaosNodeDev',
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
    xssProtection: true,
  },
  cors: {
    origin: ['http://localhost:8080'],
    credentials: true,
  },
  domain: '',
  repos: [
    {
      // generate releases and changelogs list auto /api/core/changelogs /api/core/releases
      title: 'Node',
      owner: 'weareopensource',
      repo: 'node',
      changelog: 'CHANGELOG.md',
      token: null,
    },
    {
      title: 'Vue',
      owner: 'weareopensource',
      repo: 'vue',
      changelog: 'CHANGELOG.md',
      token: null,
    },
  ],
  // Data filter whitelist & Blacklist
  blacklists: {},
  whitelists: {
    users: {
      default: [
        '_id',
        'id',
        'firstName',
        'lastName',
        'bio',
        'email',
        'avatar',
        'roles',
        'provider',
        'updatedAt',
        'createdAt',
        'resetPasswordToken',
        'resetPasswordExpires',
      ],
      update: ['firstName', 'lastName', 'bio', 'email', 'avatar'],
      updateAdmin: ['firstName', 'lastName', 'bio', 'email', 'avatar', 'roles'],
      recover: ['password', 'resetPasswordToken', 'resetPasswordExpires'],
      roles: ['user', 'admin'],
    },
  },
  uploads: {
    sharp: {
      // default sharp settings for all uploads
      blur: 8,
    },
    avatar: {
      formats: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      limits: {
        fileSize: 1 * 1024 * 1024, // Max file size in bytes (1 MB)
      },
      sharp: {
        sizes: ['128', '256', '512', '1024'],
        operations: ['blur', 'bw', 'blur&bw'],
      },
    },
  },
  // zxcvbn is used to manage password security
  zxcvbn: {
    forbiddenPasswords: [
      '12345678',
      'azertyui',
      'qwertyui',
      'azertyuiop',
      'qwertyuiop',
    ], // passwords forbidden
    minSize: 8, // min password size
    maxSize: 126, // max password size
    minimumScore: 3, // min password complexity score
  },
  // jwt is for token authentification
  jwt: {
    secret: 'WaosSecretKeyExampleToChnageAbsolutely', // secret for hash
    expiresIn: 7 * 24 * 60 * 60, // token expire in x sec
  },
  mailer: {
    from: 'WAOS_NODE_mailer_from',
    options: {
      service: 'WAOS_NODE_mailer_options_service',
      auth: {
        user: 'WAOS_NODE_mailer_options_auth_user',
        pass: 'WAOS_NODE_mailer_options_auth_pass',
      },
    },
  },
  google: {
    clientId: 'WAOS_NODE_google_clientId',
  },
  microsoft: {
    clientId: 'WAOS_NODE_microsoft_clientId',
    issuer:
      'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
    discovery:
      'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    //    issuer: 'WAOS_NODE_microsoft_issuer',
    //    discovery: 'WAOS_NODE_microsoft_discovery'
  },
  // joi is used to manage schema restrictions, on the top of mongo / orm
  joi: {
    // enabled HTTP methods for request data validation
    supportedMethods: ['post', 'put'],
    // Joi validation options
    validationOptions: {
      abortEarly: false, // abort after the last validation error
      allowUnknown: true, // allow unknown keys that will be ignored
      stripUnknown: true, // remove unknown keys from the validated data
      noDefaults: false, // automatically set to true for put method (update)
    },
  },
  seedDB: {
    seed: true,
    options: {
      logResults: true,
      seedTasks: [
        {
          title: 'title1',
          description: 'do something about something else',
        },
        {
          title: 'title2',
          description: 'do something about something else',
        },
      ],
      seedUser: {
        provider: 'local',
        email: 'seeduser@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user'],
      },
      seedAdmin: {
        provider: 'local',
        email: 'seedadmin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin'],
      },
    },
  },
};
