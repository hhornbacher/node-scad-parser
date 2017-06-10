import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import * as moo from 'moo';
import * as nearley from 'nearley';
import { ParserRules, ParserStart } from './nearley/grammar';
import { Token, tokens } from './nearley/tokens';
import {
  RootNode,
  Location
} from './ast';

/**
 * Parser for OpenSCAD code
 * 
 */
export default class SCADParser {
  private ignoredTokens: Array<string>;
  private results: Array<string>;
  private cache: Array<RootNode>;
  private codeCache: Array<string>;
  private tokenCache: Array<Array<Token>>;
  private lexer: any;

  constructor() {
    this.ignoredTokens = ['whitespace', 'eol'];
    this.results = [];
    this.cache = [];
    this.codeCache = [];
    this.tokenCache = [];
    this.lexer = moo.compile(tokens);
  }

  /**
   * Parse the supplied code
   * 
   */
  parse(code: string, file: string): RootNode {
    this.tokenCache[file] = [];
    try {
      const parser = new nearley.Parser(ParserRules, ParserStart);
      let token;

      // Feed whole code to lexer
      this.lexer.reset(code);

      // Iterate through code
      while (token = this.lexer.next()) {
        // Ignore token, if defined
        if (_.includes(this.ignoredTokens, token.type))
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
      if (last && last.type === 'LexerError') {
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
          `Parser error: Unexpected token '${last ? last.value : 'undefined'}' (Type: ${last ? last.type : 'undefined'}, ${location.toString()})\nLast tokens: ["${lastTokens.join('", "')}"]\nExcerpt:\n\n${excerpt}`);
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
   * Render the supplied code (with OpenSCAD)
   * 
   */
  render(code: string, file: string, options: any): Promise<{}> {
    const writeFile: (file: string, enc: string) => Promise<{}> = Promise.promisify(fs.writeFile);
    const exec: (command: string) => Promise<{}> = Promise.promisify(childProcess.exec);

    const execRenderer = (options: any) => {
      return exec(
        options.binaryPath
        + ' -o ' + options.outputFile
        + ' --colorscheme=' + options.colorScheme
        + ' ' + options.inputFile
      );
    };

    let _options = _.merge({
      binaryPath: '/usr/bin/openscad',
      viewAll: true,
      autoCenter: true
    }, options);
    if (!code && file) {
      _options.inputFile = file;
      return execRenderer(_options);
    }
    else if (code) {
      let tmpFile = '/tmp/' + (path.basename(file) || 'scad-parser_tmp.scad');
      return writeFile(tmpFile, 'utf8')
        .then(() => {
          _options.inputFile = tmpFile;
          return execRenderer(_options);
        });
    }
    throw new Error('Neither code or file supplied!');
  }

  /**
   * Parse the abstract syntax tree
   * 
   */
  parseAST(file: string, code: string = ''): RootNode {
    if (code !== '') {
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code, file);
    }
    else {
      let code = fs.readFileSync(file, 'utf8');
      this.codeCache[file] = code;
      this.cache[file] = this.parse(code, file);
    }
    if (this.cache[file])
      return this.cache[file];
    throw new Error('Neither code or file supplied!');
  }

  findTokens(value: string = '', type: string = '', file): Array<Token> {
    let find: { value?: string, type?: string } = {};
    if (value !== '')
      find.value = value;
    if (type !== '')
      find.type = type;
    return _.filter(this.tokenCache[file], find);
  }

  getToken(column: number, line: number, file: string): Token | null {
    let out: Token | null = null;
    _.each(this.tokenCache[file], (token: Token) => {
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
   */
  getCodeExcerpt(file: string, location: Location, lines = 3): string {
    let code = this.codeCache[file].split('\n');

    let start = location.line - (lines + 2);
    if (start < 0)
      start = 0;
    let end = location.line + (lines - 1);
    if (end >= code.length)
      end = code.length - 1;
    code = code.slice(start, location.line + (lines - 1));

    function pad(n: number, width: number) {
      let nStr = n.toString();
      return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join('0') + nStr;
    }
    function drawMarker(indent: number) {
      return _.times(indent, () => ' ').join('') + _.times(location.column + 1, () => ' ').join('')
        + '^' + _.times(location.size - 2, () => '-').join('') + '^';
    }

    return _.map(code, (line, index) => {
      if (index != location.line - 1)
        return `${pad(index + start + 1, end.toString().length)}: ${line}`;
      else
        return `${pad(index + start + 1, end.toString().length)}: ${line}\n${drawMarker(end.toString().length)}`;
    }).join('\n');
  }
}