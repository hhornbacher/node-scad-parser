const _ = require('lodash'),
  fs = require('fs'),
  moo = require('moo'),
  nearley = require("nearley"),
  grammar = require("./nearley/grammar"),
  stateStart = require("./nearley/state-start"),
  stateComment = require("./nearley/state-comment"),
  inspect = require('util').inspect;

class SCADParser {
  constructor(useCache = true) {
    const nm = require('./nearley/nearley-moo').parser(nearley, grammar);
    this.parser = nm(moo.states({start: stateStart, comment: stateComment}));
    this.parser.ignore(['whitespace', 'eol']);
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

  /*  preprocess(code) {
      // Remove inline single line comments
      code = code.replace(/^(.+)\/\/.*$/mg, '$1');
      // Remove multiline comments (while keeping line count as before)
      const mlCommentMatcher = /\/\*([\s\S]*?)\*\//g;
      _.each(code.match(mlCommentMatcher), (match) => {
        code = code.replace(match, _.times(match.split('\n').length, () => '\n').join(''));
      });
      return code;
    }*/

  parse(code) {
    try {
      this.parser.feed(code);
      return this.parser.results;
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

module.export = SCADParser;

// If we run as program try to parse an example
if (!module.parent) {
  /**
   * Detailed inspection of an Object
   * @param {Object} obj Object to inspect
   * @param {Boolean} showHidden Show non-enumberable properties
   * @param {Number} depth Defines how deep to inspect the object of interest
   * @returns {String} String with inspection result
   */
  const inspectObject = (obj, showHidden = true, depth = 5) => inspect(obj, showHidden, depth, true);

  const parser = new SCADParser();
  try {
    let index = process.argv[2] || 3;
    const ast = parser.getAST('../examples/ex' + index + '.scad');
    console.log(ast);
    console.log(ast.toString());
/*    console.log(inspectObject(_.filter(ast, (c) => {
      if(c === null)
        return false;
      return true;
    })));*/
    console.log('done');
  } catch (error) {
    console.log(error);
  }

  while (process.argv[2] && true) {
    console.log('.');
  }
}