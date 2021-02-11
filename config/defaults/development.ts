import * as buffer from 'buffer';

export interface IConfig {
  secure: any;
  files: {
    configs: string[];
    policies: string[];
    routes: string[];
    mongooseModels: string[];
  };
  app: App;
  api: API;
  db: DB;
  log: Log;
  livereload: boolean;
  csrf: CSRF;
  cors: Cors;
  domain: string;
  sign: Sign;
  repos: Repo[];
  blacklists: Blacklists;
  whitelists: Whitelists;
  uploads: Uploads;
  zxcvbn: Zxcvbn;
  jwt: Jwt;
  mailer: Mailer;
  oAuth: OAuth;
  joi: Joi;
  seedDB: SeedDB;
}

export interface API {
  protocol: string;
  port: number;
  host: string;
  base: string;
  timeout: number;
}

export interface App {
  title: string;
  description: string;
  keywords: string;
  googleAnalyticsTrackingID: string;
  contact: string;
}

export interface Blacklists {
}

export interface Cors {
  origin: string[];
  credentials: boolean;
  optionsSuccessStatus: number;
}

export interface CSRF {
  csrf: boolean;
  csp: boolean;
  xframe: string;
  p3p: string;
  xssProtection: boolean;
}

export interface DB {
  uri: string;
  debug: boolean;
  options: DBOptions;
  promise: string;
  restoreExceptions: any[];
}

export interface DBOptions {
  user: string;
  pass: string;
  useCreateIndex: boolean;
  useUnifiedTopology: boolean;
  useNewUrlParser: boolean;
  useFindAndModify: boolean;
  sslCA: Buffer | string;
  sslKey: Buffer | string;
  sslCert: Buffer | string;
}

export interface Joi {
  supportedMethods: string[];
  validationOptions: ValidationOptions;
}

export interface ValidationOptions {
  abortEarly: boolean;
  allowUnknown: boolean;
  stripUnknown: boolean;
  noDefaults: boolean;
}

export interface Jwt {
  secret: string;
  expiresIn: number;
}

export interface Log {
  format: string;
  pattern: string;
  fileLogger: FileLogger;
}

export interface FileLogger {
  directoryPath: string;
  fileName: string;
  maxsize: number;
  maxFiles: number;
  json: boolean;
}

export interface Mailer {
  from: string;
  options: MailerOptions;
}

export interface MailerOptions {
  service: string;
  auth: Auth;
}

export interface Auth {
  user: string;
  pass: string;
}

export interface OAuth {
  google: Google;
  apple: Apple;
}

export interface Apple {
  clientID: null;
  teamID: null;
  keyID: null;
  callbackURL: null;
  privateKeyLocation: null;
}

export interface Google {
  clientID: null;
  clientSecret: null;
  callbackURL: null;
}

export interface Repo {
  title: string;
  owner: string;
  repo: string;
  changelog: string;
  token: null;
}

export interface SeedDB {
  seed: boolean;
  options: SeedDBOptions;
}

export interface SeedDBOptions {
  logResults: boolean;
  seedTasks: SeedTask[];
  seedUser: Seed;
  seedAdmin: Seed;
}

export interface Seed {
  provider: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: string[];
}

export interface SeedTask {
  title: string;
  description: string;
}

export interface Sign {
  in: boolean;
  up: boolean;
}

export interface Uploads {
  sharp: UploadsSharp;
  avatar: Avatar;
}

export interface Avatar {
  formats: string[];
  limits: Limits;
  sharp: AvatarSharp;
}

export interface Limits {
  fileSize: number;
}

export interface AvatarSharp {
  sizes: string[];
  operations: string[];
}

export interface UploadsSharp {
  blur: number;
}

export interface Whitelists {
  users: Users;
}

export interface Users {
  default: string[];
  update: string[];
  updateAdmin: string[];
  recover: string[];
  roles: string[];
}

export interface Zxcvbn {
  forbiddenPasswords: string[];
  minSize: number;
  maxSize: number;
  minimumScore: number;
}

export default {
  app: {
    title: 'WeAreOpenSource Node - Development Environment',
    description:
      'Node - Boilerplate Back : Express, Jwt, Mongo, Sequelize (Beta) ',
    keywords: 'node, express, mongo, jwt, sequelize, stack, boilerplate',
    googleAnalyticsTrackingID: 'WAOS_NODE_app_googleAnalyticsTrackingID',
    contact: 'waos.me@gmail.com',
  },
  api: {
    protocol: 'http',
    port: 3000,
    host: 'localhost',
    base: 'api',
    timeout: 2 * 60 * 1000,
  },
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
  sign: {
    in: true, // disable signin
    up: true, // disable signup
  },
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
        'position',
        'email',
        'avatar',
        'roles',
        'provider',
        'updatedAt',
        'createdAt',
        'resetPasswordToken',
        'resetPasswordExpires',
        'complementary',
        'terms',
      ],
      update: ['firstName', 'lastName', 'bio', 'position', 'email', 'avatar', 'complementary'],
      updateAdmin: ['firstName', 'lastName', 'bio', 'position', 'email', 'avatar', 'roles', 'complementary'],
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
  oAuth: {
    google: {
      // google console / api & service / identifier
      clientID: null,
      clientSecret: null,
      callbackURL: null,
    },
    apple: {
      clientID: null, // developer.apple.com service identifier
      teamID: null, // developer.apple.com team identifier
      keyID: null, // developer.apple.com private key identifier
      callbackURL: null,
      privateKeyLocation: null,
    },
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
