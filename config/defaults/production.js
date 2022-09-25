import _ from 'lodash';

const config = await import('./development.js');

export default _.merge(config.default, {
  app: {
    title: 'WeAreOpenSource Node - Production Environment',
  },
  api: {
    host: '0.0.0.0',
    port: 4200,
  },
  db: {
    uri: 'mongodb://localhost/WaosNode',
    debug: false,
  },
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt',
  },
  log: {
    format: 'custom',
    pattern:
      ':id :email :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', // only for custom format
  },
  livereload: false,
});
