"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
function success(res, message) {
    return (data) => {
        const result = {
            type: 'success',
            message,
            data,
        };
        res.status(200)
            .json(result);
        return result;
    };
}
exports.success = success;
function error(res, code, message, description) {
    return (errorDetails) => {
        const result = {
            type: 'error',
            message: message || errorDetails.message,
            code: code || errorDetails.code,
            description: description || errorDetails.description || errorDetails.details || '',
            error: JSON.stringify(errorDetails),
        };
        res.status(code || errorDetails.code)
            .json(result);
        return result;
    };
}
exports.error = error;
//# sourceMappingURL=responses.js.map