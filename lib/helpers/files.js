/**
 * Module dependencies
 */
import fs from "fs";

/**
 * @desc readFile from path
 * @param {String} file path
 * @return {String} file
 */
 const readFile = async (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

  export default {
    readFile 
  }