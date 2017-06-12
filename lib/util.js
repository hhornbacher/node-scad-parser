"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmp = require("tmp");
const fs = require("fs");
const childProcess = require("child_process");
const _ = require("lodash");
function pfy(func, resultKeys) {
    return (...args) => new Promise((resolve, reject) => {
        func(...args, (err, ...result) => {
            if (err)
                return reject(err);
            if (!(result.length > 1) || _.isString(resultKeys) || !resultKeys)
                return resolve(result[0]);
            return resolve(_.zipObject(resultKeys, result));
        });
    });
}
exports.pfy = pfy;
exports.tmpFile = pfy(tmp.file, ['path', 'fd', 'cleanupCb']);
exports.tmpDir = pfy(tmp.dir, ['path', 'fd', 'cleanupCb']);
exports.tmpName = pfy(tmp.tmpName);
exports.tmpSetGracefulCleanup = tmp.setGracefulCleanup;
/*----- Promisified FS functions -----*/
exports.write = pfy(fs.write);
exports.open = pfy(fs.open);
exports.readFile = pfy(fs.readFile);
exports.writeFile = pfy(fs.writeFile);
exports.symlink = pfy(fs.symlink);
exports.stat = pfy(fs.stat);
exports.exec = pfy(childProcess.exec);
//# sourceMappingURL=util.js.map