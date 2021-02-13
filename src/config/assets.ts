export default {
  gulpConfig: ['dist/src/gulpfile.js'],
  allts: ['dist/src/server.js', 'dist/src/config/**/*.js', 'dist/src/lib/**/*.js', 'dist/src/modules/*/**/*.js'],
  mongooseModels: 'dist/src/modules/*/models/*.mongoose.js',
  sequelizeModels: 'dist/src/modules/*/models/*.sequelize.js',
  routes: ['dist/src/modules/!(core)/routes/*.js', 'dist/src/modules/core/routes/*.js'],
  // sockets: 'dist/src/modules/*/sockets/*.js',
  config: ['dist/src/modules/*/config/*.js'],
  policies: 'dist/src/modules/*/policies/*.js',
  tests: ['dist/src/dist/src/modules/*/tests/**/*.js'],
  views: ['dist/src/modules/*/views/*.html'],
};
