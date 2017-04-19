const _ = require('lodash'),
  fs = require('fs'),
  nearley = require("nearley"),
  grammar = require("./nearley/scad-parser"),
  inspect = require('util').inspect;


class SCADParser extends nearley.Parser {
  constructor(useCache = true) {
    super(grammar.ParserRules, grammar.ParserStart);
    this.useCache = useCache;
    if (useCache) {
      _.each({
        cache: [],
        codeCache: [],
      },
        (value, key) => {
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
        });
    }
  }

  preprocess(code) {
    // Remove inline single line comments
    code = code.replace(/^(.+)\/\/.*$/mg, '$1');
    // Remove multiline comments (while keeping line count as before)
    const mlCommentMatcher = /\/\*([\s\S]*?)\*\//g;
    _.each(code.match(mlCommentMatcher), (match) => {
      code = code.replace(match, _.times(match.split('\n').length, () => '\n').join(''));
    });
    return code;
  }

  parse(code) {
    try {
      this.feed(this.preprocess(code));
      return this.results;
    } catch (error) {
      error.location = this.offsetToLocation(code, error.offset);
      throw error;
    }
  }

  getCode(file, code) {
    if (this.useCache) {
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code);
      return this.cache[file];
    }
    else {
      return this.parse(code);
    }
  };

  getFile(file) {
    let code = fs.readFileSync(file, 'utf8');
    if (this.useCache) {
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code);
      return this.cache[file];
    }
    else {
      return this.parse(code);
    }
  };

  getAST(file = null, code = null) {
    if (this.useCache && this.cache[file])
      return cache[file];

    if (!_.isString(file) && !_.isString(code))
      throw new Error('You have to pass either code or file parameter!');

    let result;
    if (code)
      [result] = this.getCode(file, code);
    else
      [result] = this.getFile(file);

    return result;
  }

  offsetToLocation(code, offset) {
    let codeToOffset = code.substr(0, offset);
    let lines = codeToOffset.split('\n');
    let line = lines.length;
    let column = lines[lines.length - 1].length + 1;
    return {
      line,
      column
    };
  }
}

/**
 * Detailed inspection of an Object
 * @param {Object} obj Object to inspect
 * @param {Boolean} showHidden Show non-enumberable properties
 * @param {Number} depth Defines how deep to inspect the object of interest
 * @returns {String} String with inspection result
 */
const inspectObject = (obj, showHidden = true, depth = 5) => inspect(obj, showHidden, depth, true);


// If called directly try to parse an example
if (!module.parent) {
  const parser = new SCADParser();
  try {
    const ast = parser.getAST('../examples/ex'+process.argv[2]+'.scad');
    //console.log(inspectObject(ast.children));
    console.log(ast.toString());
  } catch (error) {
    console.log(inspectObject(error));
  }
}
else
  module.exports = SCADParser;