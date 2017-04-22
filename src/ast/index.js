/**
 * Abstract syntax representation of the scad language
 * @module ast
 */
const _ = require('lodash'),
    inspect = require('util').inspect;



/**
 * Register a class as global
 * @param {Class} cl The class to register 
 * @param {String} name Optional: To set the class name manually
 */
const registerClass = function (cl, name) {
    global[name || cl.name] = cl;
};

// Register lodash as global
registerClass(_, '_');

/**
 * Location in the code
 * 
 * @class Location
 * 
 * @param {Token} token The token from which to get the positional information
 */
class Location {
    constructor({ offset, size, lineBreaks, line, col }) {
        this.offset = offset;
        this.size = size;
        this.lineBreaks = lineBreaks;
        this.line = line;
        this.column = col;
    }

    toString() {
        return `[Location: Offset=${this.offset}, Size=${this.size}, lineBreaks=${this.lineBreaks}, Line=${this.line}, Column=${this.column}]`;
    }
}
registerClass(Location);

// Register value classes as global
require('./values')(registerClass);

// Register node classes as global
require('./nodes')(registerClass);

