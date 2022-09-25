import _ from 'lodash';

const config = await import('./development.js');

export default _.merge(config.default, {
  app: {
    title: 'WeAreOpenSource Node - Test Environment',
  },
  api: {
    host: 'localhost',
    port: 3001,
  },
  port: 3001,
  db: {
    uri: 'mongodb://localhost/WaosNodeTest',
    debug: false,
  },
  livereload: false,
});
