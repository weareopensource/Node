/**
 * Module dependencies
 */
const ApisRepository = require('../repositories/apis.repository');

/**
 * @desc Function to ask repository to import a list of apis
 * @param {[Object]} apis
 * @param {[String]} filters
 * @return {Promise} apis
 */
exports.import = (apis, filters) => {
  const result = ApisRepository.import(apis, filters);
  return result;
};
