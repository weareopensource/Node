/**
 * @desc generate list of all objects keys
 * @param {Object} object
 * @return {[String]} array of path
 */
exports.objectDeepKeys = (obj) => Object.keys(obj).filter((key) => obj[key] instanceof Object).map((key) => this.objectDeepKeys(obj[key]).map((k) => `${key}.${k}`)).reduce((x, y) => x.concat(y), Object.keys(obj));
