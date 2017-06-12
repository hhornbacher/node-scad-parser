"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const repl = require("repl");
const _ = require("lodash");
const moo = require("moo");
const nearley = require("nearley");
const grammar_1 = require("./nearley/grammar");
const tokens_1 = require("./nearley/tokens");
const ast_1 = require("./ast");
const util = require("./util");
/**
 * Parser for OpenSCAD code
 *
 */
class SCADParser {
    constructor() {
        this.ignoredTokens = ['whitespace', 'eol'];
        this.results = [];
        this.cache = [];
        this.codeCache = [];
        this.tokenCache = [];
        this.lexer = moo.compile(tokens_1.tokens);
        util.tmpSetGracefulCleanup();
    }
    static repl(context = {}) {
        const parser = new SCADParser();
        const _context = Object.assign({}, context, { parser, testRender: () => parser.render(null, '/home/harry/Dokumente/Development/Private/3D/thermostirrer/coil-holder.scad').then(out => console.log(out)) });
        console.log('Started in REPL-mode\n' +
            'Locally defined variables:\n' +
            _.map(_context, (val, key) => `var ${key} = ${val.toString()}`).join('\n'));
        const r = repl.start({
            prompt: '> ',
            useColors: true
        });
        _.each(_context, (value, key) => {
            Object.defineProperty(r.context, key, {
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
    parse(code, file) {
        this.tokenCache[file] = [];
        try {
            const parser = new nearley.Parser(grammar_1.ParserRules, grammar_1.ParserStart);
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
            return new ast_1.RootNode(parser.results[0]);
        }
        catch (error) {
            // Get last lexed token
            const last = this.tokenCache[file][this.tokenCache[file].length - 1];
            // Check if last token is a LexerError
            if (last && last.type === 'LexerError') {
                let location = new ast_1.Location(last);
                let excerpt = this.getCodeExcerpt(file, location);
                error = new Error(`Lexer error:\n${last.value} ${location.toString()}\nExcerpt:\n\n${excerpt}`);
                // Add the location to the error
                error.location = location;
            }
            else {
                let location = new ast_1.Location(last);
                let excerpt = this.getCodeExcerpt(file, location);
                let lastTokens = this.tokenCache[file].slice(this.tokenCache[file].length - 3, this.tokenCache[file].length);
                error = new Error(`Parser error: Unexpected token '${last ? last.value : 'undefined'}' (Type: ${last ? last.type : 'undefined'}, ${location.toString()})\nLast tokens: ["${lastTokens.join('", "')}"]\nExcerpt:\n\n${excerpt}`);
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
    render(code, file, options = {}) {
        const execRenderer = (options) => {
            return util.tmpName({
                postfix: '.stl'
            })
                .then(path => {
                const args = ` -o ${path}`
                    + (options.colorScheme ? ' --colorscheme=' + options.colorScheme : '')
                    + ' ' + options.inputFile;
                return util.exec(options.binaryPath
                    + args)
                    .then(() => util.readFile(path, 'utf8'));
            });
        };
        let _options = Object.assign({ binaryPath: '/usr/bin/openscad', viewAll: true, autoCenter: true }, options);
        if (file) {
            return execRenderer(Object.assign({}, _options, { inputFile: file }))
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
                    return execRenderer(Object.assign({}, _options, { inputFile: path }))
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
    parseAST(file, code = '') {
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
    findTokens(value = '', type = '', file) {
        let find = {};
        if (value !== '')
            find.value = value;
        if (type !== '')
            find.type = type;
        return _.filter(this.tokenCache[file], find);
    }
    getToken(column, line, file) {
        let out = null;
        _.each(this.tokenCache[file], (token) => {
            if (line == token.line &&
                (column >= token.col && column < (token.col + token.size))) {
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
    getCodeExcerpt(file, location, lines = 3) {
        let code = this.codeCache[file].split('\n');
        let start = location.line - (lines + 2);
        if (start < 0)
            start = 0;
        let end = location.line + (lines - 1);
        if (end >= code.length)
            end = code.length - 1;
        code = code.slice(start, location.line + (lines - 1));
        function pad(n, width) {
            let nStr = n.toString();
            return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join('0') + nStr;
        }
        function drawMarker(indent) {
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
exports.default = SCADParser;
if (require.main === module) {
    SCADParser.repl();
}
//# sourceMappingURL=index.js.map