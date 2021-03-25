/**
 * Module dependencies
 */
const fs = require('fs');

/**
 * @desc readFile from path
 * @param {String} file path
 * @return {String} file
 */
exports.readFile = async (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
