const _ = require('lodash'),
  fs = require('fs'),
  moo = require('moo'),
  nearley = require("nearley"),
  grammar = require("./nearley/grammar"),
  stateStart = require("./nearley/state-start"),
  stateComment = require("./nearley/state-comment"),
  inspect = require('util').inspect;

const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
const lexer = moo.states({ start: stateStart, comment: stateComment });

class SCADParser {
  constructor() {
    this.ignoredTokens = ['whitespace', 'eol'];
    this.results = null;
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

  parse(code, file) {
    let tokens = [];
    try {
      let token;

      // Feed whole code to lexer
      lexer.reset(code);

      // Iterate through code
      while (token = lexer.next()) {
        // Ignore token, if defined
        if (this.ignoredTokens.includes(token.type))
          continue;

        // Capture token
        tokens.push(token);

        // Feed the token to the parser
        parser.feed([token]);
      }
      return new RootNode(parser.results[0]);
    } catch (error) {
      // Get last lexed token
      const last = tokens[tokens.length - 1];

      // Check if last token is a LexerError
      if (last.type === 'LexerError') {
        error = new Error(`Lexer error:\n${last.value}`);
        // Add the location to the error
        //error.location = _.pick(last, ['offset', 'size', 'lineBreaks', 'line', 'col']);
        error.location = new Location(last);
      }
      else {
        error = new Error(`Parser error: Unexpected ${last.type} '${last.value}'`);
        // Add the last 3 tokens to the error
        error.lastTokens = tokens.slice(tokens.length - 3, tokens.length);
        // Add the location to the error
        error.location = new Location(last);
        // Add the code excerpt to the error
        error.excerpt = this.getCodeExcerpt(file, error.location);
      }
      throw error;
    }
  }

  parseAST(file, code = null) {
    if (this.cache[file])
      return cache[file];

    if (!_.isString(file) && !_.isString(code))
      throw new Error('You have to pass either code or file parameter!');

    let result;
    if (code)
      [result] = this.getCode(file, code);
    else {
      let code = fs.readFileSync(file, 'utf8');
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code, file);
    }

    return this.cache[file];
  }

  getCodeExcerpt(file, location, lines = 3) {
    if (!this.codeCache[file]) {
      let code = fs.readFileSync(file, 'utf8');
      this.codeCache[file] = code;
    }
    let code = this.codeCache[file].split('\n');
    code = code.slice(location.line-(lines+2), location.line+(lines-1));
    return code.join('\n');
  }
}

module.exports = SCADParser;

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
    let index = process.argv[2] || 1;
    const ast = parser.parseAST('../examples/ex' + index + '.scad');
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