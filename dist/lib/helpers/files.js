"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const fs_1 = tslib_1.__importDefault(require("fs"));
async function readFile(path) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
exports.default = readFile;
//# sourceMappingURL=files.js.map