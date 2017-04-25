const _ = require('lodash'),
  fs = require('fs'),
  moo = require('moo'),
  nearley = require("nearley"),
  grammar = require("./nearley/grammar"),
  tokens = require("./nearley/tokens").tokens,
  inspect = require('util').inspect;

const lexer = moo.compile(tokens);

/**
 * Parser for OpenSCAD code
 */
class SCADParser {
  constructor() {
    this.ignoredTokens = ['whitespace', 'eol'];
    this.results = null;
    this.cache = [];
    this.codeCache = [];
    this.tokenCache = [];
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
    this.tokenCache[file] = [];
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
        this.tokenCache[file].push(token);

        // Feed the token to the parser
        parser.feed([token]);
      }
      return new RootNode(parser.results[0]);
    } catch (error) {
      // Get last lexed token
      const last = this.tokenCache[file][this.tokenCache[file].length - 1];

      // Check if last token is a LexerError
      if (last.type === 'LexerError') {
        let location = new Location(last);
        let excerpt = this.getCodeExcerpt(file, location);
        error = new Error(`Lexer error:\n${last.value} ${location.toString()}\nExcerpt:\n\n${excerpt}`);
        // Add the location to the error
        error.location = location;
      }
      else {
        let location = new Location(last);
        let excerpt = this.getCodeExcerpt(file, location);
        let lastTokens = this.tokenCache[file].slice(this.tokenCache[file].length - 3, this.tokenCache[file].length);
        error = new Error(
          `Parser error: Unexpected token '${last.value}' (Type: ${last.type}, ${location.toString()})\nLast tokens: ["${lastTokens.join('", "')}"]\nExcerpt:\n\n${excerpt}`);
        // Add the last 3 tokens to the error
        error.lastTokens = lastTokens;
        // Add the location to the error
        error.location = location;
        // Add the code excerpt to the error
        error.excerpt = excerpt;
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

  getToken(column, line, file) {
    let out = null;
    _.each(this.tokenCache[file], token => {
      if (
        line == token.line &&
        (column >= token.col && column < (token.col + token.size))
      ) {
        out = token;
        return false;
      }
    });
    return out;
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

    const start = location.line - (lines + 2);
    const end = location.line + (lines - 1);
    code = code.slice(start, location.line + (lines - 1));

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    function drawMarker(indent) {
      return _.times(indent, () => ' ').join('') + _.times(location.column + 1, () => ' ').join('')
        + '^' + _.times(location.size - 2, () => '-').join('') + '^';
    }

    return _.map(code, (line, index) => {
      if (index != (lines + 1))
        return `${pad(index + start + 1, end.toString().length)}: ${line}`;
      else
        return `${pad(index + start + 1, end.toString().length)}: ${line}\n${drawMarker(end.toString().length)}`;
    }).join('\n');
  }
}

module.exports = SCADParser;

// If we run as program try to parse an example
if (!module.parent) {
  const parser = new SCADParser();
  try {
    let index = process.argv[2] || 1;
    const ast = parser.parseAST('../examples/ex' + index + '.scad');
    console.log(parser.getToken({
      character: 7,
      line: 14
    }, '../examples/ex' + index + '.scad'));
    console.log(ast.findByToken(parser.getToken({
      character: 7,
      line: 14
    }, '../examples/ex' + index + '.scad')).toString());
    console.log(ast.toString());
    console.log('done');
  } catch (error) {
    console.log(error);
  }

  while (process.argv[2] && true) {
    console.log('.');
  }
}