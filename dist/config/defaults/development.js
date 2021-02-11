"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    app: {
        title: 'WeAreOpenSource Node - Development Environment',
        description: 'Node - Boilerplate Back : Express, Jwt, Mongo, Sequelize (Beta) ',
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
        },
        promise: global.Promise,
        restoreExceptions: [],
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
        pattern: ':id :email :method :url :status :response-time ms - :res[content-length]',
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
        in: true,
        up: true,
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
                fileSize: 1 * 1024 * 1024,
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
        ],
        minSize: 8,
        maxSize: 126,
        minimumScore: 3,
    },
    // jwt is for token authentification
    jwt: {
        secret: 'WaosSecretKeyExampleToChnageAbsolutely',
        expiresIn: 7 * 24 * 60 * 60,
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
            clientID: null,
            teamID: null,
            keyID: null,
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
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
            noDefaults: false,
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
//# sourceMappingURL=development.js.map