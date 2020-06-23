/**
 * @desc generate list of all objects keys
 * @param {Object} object
 * @return {[String]} array of path
 */
exports.objectDeepKeys = (obj) => Object.keys(obj).filter((key) => obj[key] instanceof Object).map((key) => this.objectDeepKeys(obj[key]).map((k) => `${key}.${k}`)).reduce((x, y) => x.concat(y), Object.keys(obj));

/**
 * @desc generate new schema object, replace all path value with new one
 * @param {Object} o - sample object
 * @param {String} op - old path
 * @param {String} np - new path
 * @return {Object} new schema object
 */
exports.generateObject = (o, op, np) => {
  const result = {};
  Object.keys(o).forEach((key) => {
    if (typeof o[key] === 'object') {
      result[key] = this.generateObject(o[key], op, np);
    } else {
      result[key] = o[key].replace(op, np);
    }
  });
  return result;
};
