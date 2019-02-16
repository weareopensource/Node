module.exports = {
  app: {
    title: 'WeAreOpenSource Node',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: 'WAOS_NODE_app_googleAnalyticsTrackingID',
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
      useNewUrlParser: true,
      useFindAndModify: false,
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
    promise: global.Promise,
  },
  secure: {
    ssl: false,
    /**
     ssl: true,
     privateKey: './config/sslcerts/key.pem',
     certificate: './config/sslcerts/cert.pem',
     caBundle: './config/sslcerts/cabundle.crt'
    */
  },
  log: {
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
    url: 'http://localhost:4200',
  },
  illegalUsernames: ['waos', 'weareopensource', 'administrator', 'password', 'admin', 'user', 'unknown', 'anonymous', 'null', 'undefined', 'api'],
  roles: ['user', 'admin'],
  uploads: {
    profile: {
      image: {
        dest: './uploads',
        limits: {
          fileSize: 1 * 1024 * 1024, // Max file size in bytes (1 MB)
        },
      },
    },
  },
  // zxcvbn is used to manage password security
  zxcvbn: {
    minimumScore: 3,
  },
  jwt: {
    secret: 'test',
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
    issuer: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
    discovery: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
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
        roles: ['user'],
      },
      seedAdmin: {
        username: 'seedadmin',
        provider: 'local',
        email: 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin'],
      },
    },
  },
};
