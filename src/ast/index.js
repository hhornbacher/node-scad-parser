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

/**
 * Detailed inspection of an Object
 * 
 * @global
 * @param {Object} obj Object to inspect
 * @param {Boolean} showHidden Show non-enumberable properties
 * @param {Number} depth Defines how deep to inspect the object of interest
 * @returns {String} String with inspection result
 */
const inspectObject = (obj, showHidden = true, depth = 10) => inspect(obj, showHidden, depth, true);

// Register inspectObject as global
global.inspectObject = inspectObject;
// Register lodash as global
registerClass(_, '_');

/**
 * Base class for all AST related classes
 * 
 * @class SCADBaseClass
 * @param {Object} privateProperties Define private properties, that will be hidden inside `this.__`
 * 
 */
class SCADBaseClass {
    constructor(privateProperties) {
        Object.defineProperty(this, '__', {
            enumerable: false,
            writable: true,
            value: {}
        })
        _.each(privateProperties, (value, key) => {
            let readOnly = /^_.*/.test(key);

            if (readOnly) {
                key = key.replace('_', '');
            }

            this.__[key] = value;

            let options = {
                enumerable: true,
                get: () => {
                    return this.__[key];
                }
            };

            if (!readOnly)
                options.set = (val) => {
                    this.__[key] = val;
                };

            Object.defineProperty(this, key, options);
        })
    }

    toString() {
        return inspectObject(this);
    }
}
registerClass(SCADBaseClass);

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
        return inspectObject(this);
    }
}
registerClass(Location);

// Register value classes as global
require('./values')(registerClass);

// Register node classes as global
require('./nodes')(registerClass);

