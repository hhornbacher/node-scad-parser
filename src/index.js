const _ = require('lodash'),
  fs = require('fs'),
  moo = require('moo'),
  nearley = require("nearley"),
  grammar = require("./nearley/grammar"),
  stateStart = require("./nearley/state-start"),
  stateComment = require("./nearley/state-comment"),
  inspect = require('util').inspect;

const lexer = moo.states({ start: stateStart, comment: stateComment });

/**
 * Parser for OpenSCAD code
 */
class SCADParser {
  constructor() {
    this.ignoredTokens = ['whitespace', 'eol'];
    this.results = null;
    this.cache = [];
    this.codeCache = [];
  }

  /**
   * Parse the supplied code
   * 
   * @param {string} code Cointains the code to be parsed
   * @param {string} file Name of the parsed file
   * @returns {RootNode} Root node of the code's AST
   * 
   * @memberOf SCADParser
   */
  parse(code, file) {
    let tokens = [];
    try {
      const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
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

  /**
   * Parse the abstract syntax tree
   * 
   * @param {string} file Path to the code file
   * @param {string} [code=null] Code of the file to parse (Only supplied, if the file content was read before)
   * @returns {RootNode} Root node of the code's AST
   * 
   * @memberOf SCADParser
   */
  parseAST(file, code = null) {
    /*    if (this.cache[file])
          return this.cache[file];*/

    if (!_.isString(file) && !_.isString(code))
      throw new Error('You have to pass either code or file parameter!');

    let result;
    if (code) {
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code, file);
    }
    else {
      let code = fs.readFileSync(file, 'utf8');
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code, file);
    }

    return this.cache[file];
  }

  /**
   * Get an except of the code file
   * 
   * @param {string} file Path to the code file
   * @param {Location} location Location of interest
   * @param {number} [lines=3] Coount of lines to print before and after the line of interest
   * @returns {string} The code excerpt string
   * 
   * @memberOf SCADParser
   */
  getCodeExcerpt(file, location, lines = 3) {
    let code = this.codeCache[file].split('\n');
    code = code.slice(location.line - (lines + 2), location.line + (lines - 1));
    return code.join('\n');
  }
}

module.exports = SCADParser;

// If we run as program try to parse an example
if (!module.parent) {
  const parser = new SCADParser();
  try {
    let index = process.argv[2] || 1;
    const ast = parser.parseAST('../examples/ex' + index + '.scad');
    console.log(ast.toString());
    console.log('done');
  } catch (error) {
    console.log(error);
  }

  while (process.argv[2] && true) {
    console.log('.');
  }
}