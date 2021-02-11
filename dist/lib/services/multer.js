"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileName = exports.create = exports.storage = exports.storageInfo = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const mongoose_gridfs_1 = require("mongoose-gridfs");
const AppError = require(path_1.default.resolve('./lib/helpers/AppError'));
/**
 * @desc File filter
 * @param {Array} formats - array of accepted mimetype string
 * @return {callback}
 */
const fileFilter = (formats) => (req, file, callback) => {
    if (formats.includes(file.mimetype))
        callback(null, true);
    else
        callback(new AppError(`Only ${formats} images allowed`, { code: 'SERVICE_ERROR' }), false);
};
/**
 * set Strorage
 */
function storage() {
    exports.storageInfo = mongoose_gridfs_1.createBucket({
        bucketName: 'uploads',
        model: 'Uploads',
    });
}
exports.storage = storage;
/**
 * @desc file upload middleware
 * @param {String} name - key data name in form-data
 * @param {Object} config - multer config
 * @return {callback}
 */
function create(name, config) {
    return async (req, res, next) => {
        // set options
        const options = lodash_1.default.cloneDeep(config) || {};
        if (options.formats) {
            options.fileFilter = fileFilter(options.formats);
            delete options.formats;
        }
        // set storage
        options.storage = storage;
        // upload
        const upload = multer_1.default(options)
            .single(name);
        upload(req, res, (err) => {
            if (err) {
                req.multerErr = err;
                next();
            }
            else {
                next();
            }
        });
    };
}
exports.create = create;
function generateFileName(filename) {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(32, (err, buf) => {
            if (err)
                reject(new AppError('Error generateFileName', { code: 'SERVICE_ERROR' }));
            resolve(buf.toString('hex') + path_1.default.extname(filename));
        });
    });
}
exports.generateFileName = generateFileName;
//# sourceMappingURL=multer.js.map