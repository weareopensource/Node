const resolve = require("enhanced-resolve");

const resolver = (path, options) => {
  const { defaultResolver } = options;

  try {
    return defaultResolver(path, options);
  } catch (e) {
    const result = resolve.sync(options.basedir, path);
    if (result) {
      return result;
    } else {
      throw e;
    }
  }
};

module.exports = resolver;