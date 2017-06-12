import * as fs from 'fs';
import * as repl from 'repl';
import * as _ from 'lodash';
import * as moo from 'moo';
import * as nearley from 'nearley';
import {
  ParserRules,
  ParserStart
} from './nearley/grammar';
import {
  Token,
  tokens
} from './nearley/tokens';
import {
  RootNode,
  Location
} from './ast';
import * as util from './util';

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
    util.tmpSetGracefulCleanup();
  }

  static repl(context: { [key: string]: any } = {}) {
    const parser = new SCADParser();
    const _context = {
      ...context,
      parser,
      testRender: () => parser.render(null, '/home/harry/Dokumente/Development/Private/3D/thermostirrer/coil-holder.scad').then(out => console.log(out))
    };

    console.log(
      'Started in REPL-mode\n' +
      'Locally defined variables:\n' +
      _.map(_context, (val, key) => `var ${key} = ${val.toString()}`).join('\n')
    );
    const r = repl.start({
      prompt: '> ',
      useColors: true
    });
    _.each(_context, (value: any, key: string) => {
      Object.defineProperty((r as { [key: string]: any }).context, key, {
        configurable: false,
        enumerable: true,
        value
      });
    });
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
  render(code: string | null, file: string | null, options: any = {}): Promise<string> {

    const execRenderer = (options: { [key: string]: any }) => {
      return util.tmpName({
        postfix: '.stl'
      })
        .then(path => {
          const args = ` -o ${path}`
            + (options.colorScheme ? ' --colorscheme=' + options.colorScheme : '')
            + ' ' + options.inputFile;
          return util.exec(
            options.binaryPath
            + args
          )
            .then(() => util.readFile(path, 'utf8'));
        });
    };

    let _options = {
      binaryPath: '/usr/bin/openscad',
      viewAll: true,
      autoCenter: true,
      ...options
    };

    if (file) {
      return execRenderer({
        ..._options,
        inputFile: file
      })
        .catch(err => {
          console.log(err);
        });
    }
    else if (code) {
      return util.tmpName({
        postfix: '.scad'
      }).then(path => {
        return util.writeFile(path, code)
          .then(() => {
            return execRenderer({
              ..._options,
              inputFile: path
            })
              .catch(err => {
                console.log(err);
              });
          });
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

if (require.main === module) {
  SCADParser.repl();
}
