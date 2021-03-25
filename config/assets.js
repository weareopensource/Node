/* eslint comma-dangle:[0, "only-multiline"] */
module.exports = {
  gulpConfig: ['gulpfile.js'],
  allJS: ['server.js', 'config/**/*.js', 'lib/**/*.js', 'modules/*/**/*.js'],
  allYaml: 'modules/*/doc/*.yml',
  mongooseModels: 'modules/*/models/*.mongoose.js',
  sequelizeModels: 'modules/*/models/*.sequelize.js',
  routes: ['modules/!(core)/routes/*.js', 'modules/core/routes/*.js'],
  // sockets: 'modules/*/sockets/*.js',
  config: ['modules/*/config/*.js'],
  policies: 'modules/*/policies/*.js',
  tests: ['modules/*/tests/**/*.js'],
  views: ['modules/*/views/*.html'],
};
