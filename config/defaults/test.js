import _ from "lodash";
import path from "path";
const defaultConfig = await import(path.resolve('./development.js'));

export default _.merge(defaultConfig, {
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
