/**
 * Module dependencies
 */
import fs from 'fs';

export default async function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
