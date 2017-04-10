const _ = require('lodash'),
  fs = require('fs'),
  nearley = require("nearley"),
  grammar = require("./nearley/scad-parser"),
  inspect = require('util').inspect;
//pegParser = require('./peg/scad-peg-parser');


class SCADParser extends nearley.Parser {
  constructor() {
    super(grammar.ParserRules, grammar.ParserStart);
    const privateProperties = {
      cache: [],
      codeCache: [],
    };
    _.each(privateProperties, (value, key) => {
      let readOnly = /^_.*/.test(key);

      if (readOnly) {
        key = key.replace('_', '');
      }

      const privateName = '_' + key;

      this[privateName] = value;

      let options = {
        enumerable: true,
        get: () => {
          return this[privateName];
        }
      };

      if (!readOnly)
        options.set = (val) => {
          this[privateName] = val;
        };

      Object.defineProperty(this, key, options);
    })
  }

  loadCode(file, code, useCache) {
    if (useCache) {
      this.codeCache[file] = code;
      this.feed(code);
      this.cache[file] = this.results;
      return this.cache[file];
    }
    else {
      this.feed(code);
      return this.results;
    }
  };

  loadFile(file, useCache) {
    let code = fs.readFileSync(file, 'utf8');
    if (useCache) {
      this.codeCache[file] = code;
      this.feed(code);
      this.cache[file] = this.results;
      return this.cache[file];
    }
    else {
      this.feed(code);
      return this.results;
    }
  };

  getAST(file = null, code = null, useCache = true) {
    if (useCache && this.cache[file])
      return cache[file];

    if (!_.isString(file) && !_.isString(code))
      throw new Error('You have to pass either code or file parameter!');

    let result;
    if (code)
      result = this.loadCode(file, code, useCache);
    else
      result = this.loadFile(file, useCache);

    return result;
  }
}

/**
 * Detailed inspection of an Object
 * @param {Object} obj Object to inspect
 * @param {Boolean} showHidden Show non-enumberable properties
 * @param {Number} depth Defines how deep to inspect the object of interest
 * @returns {String} String with inspection result
 */
const inspectObject = (obj, showHidden = true, depth = 10) => inspect(obj, showHidden, depth, true);

// If called directly try to parse an example
if (!module.parent) {
  try {
    parser = new SCADParser();
    const ast = parser.getAST('../examples/ex4.scad');
    console.log(ast.toString());
  } catch (error) {
    console.log(error);
  }
}
else
  module.exports = SCADParser;