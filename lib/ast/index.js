"use strict";
/**
 * Abstract syntax representation of the scad language
 *
 */
/*import * as _ from 'lodash';
import { inspect } from 'util';*/
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./values"));
__export(require("./nodes"));
/**
 * Location in the code
 *
 *
 *
 *
 */
var Location = (function () {
    function Location(token) {
        var _a = token || { offset: 0, size: 0, lineBreaks: 0, line: 1, col: 1 }, offset = _a.offset, size = _a.size, lineBreaks = _a.lineBreaks, line = _a.line, col = _a.col;
        this.offset = offset;
        this.size = size;
        this.lineBreaks = lineBreaks;
        this.line = line;
        this.column = col;
    }
    Location.prototype.toString = function () {
        return "[Location: Offset=" + this.offset + ", Size=" + this.size + ", lineBreaks=" + this.lineBreaks + ", Line=" + this.line + ", Column=" + this.column + "]";
    };
    return Location;
}());
exports.Location = Location;
//# sourceMappingURL=index.js.map