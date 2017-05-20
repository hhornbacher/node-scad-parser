"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Promise = require("bluebird");
var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");
var moo = require("moo");
var nearley = require("nearley");
var grammar_1 = require("./nearley/grammar");
var tokens_1 = require("./nearley/tokens");
var ast_1 = require("./ast");
/**
 * Parser for OpenSCAD code
 *
 *
 *
 */
var SCADParser = (function () {
    function SCADParser() {
        this.ignoredTokens = ['whitespace', 'eol'];
        this.results = [];
        this.cache = [];
        this.codeCache = [];
        this.tokenCache = [];
        this.lexer = moo.compile(tokens_1.tokens);
    }
    /**
     * Parse the supplied code
     *
     *
     *
     *
     */
    SCADParser.prototype.parse = function (code, file) {
        this.tokenCache[file] = [];
        try {
            var parser = new nearley.Parser(grammar_1.grammar.ParserRules, grammar_1.grammar.ParserStart);
            var token = void 0;
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
            var last = this.tokenCache[file][this.tokenCache[file].length - 1];
            // Check if last token is a LexerError
            if (last && last.type === 'LexerError') {
                var location_1 = new ast_1.Location(last);
                var excerpt = this.getCodeExcerpt(file, location_1);
                error = new Error("Lexer error:\n" + last.value + " " + location_1.toString() + "\nExcerpt:\n\n" + excerpt);
                // Add the location to the error
                error.location = location_1;
            }
            else {
                var location_2 = new ast_1.Location(last);
                var excerpt = this.getCodeExcerpt(file, location_2);
                var lastTokens = this.tokenCache[file].slice(this.tokenCache[file].length - 3, this.tokenCache[file].length);
                error = new Error("Parser error: Unexpected token '" + (last ? last.value : 'undefined') + "' (Type: " + (last ? last.type : 'undefined') + ", " + location_2.toString() + ")\nLast tokens: [\"" + lastTokens.join('", "') + "\"]\nExcerpt:\n\n" + excerpt);
                // Add the last 3 tokens to the error
                error.lastTokens = lastTokens;
                // Add the location to the error
                error.location = location_2;
                // Add the code excerpt to the error
                error.excerpt = excerpt;
            }
            throw error;
        }
    };
    /**
     * Render the supplied code (with OpenSCAD)
     *
     *
     *
     *
     *
     */
    SCADParser.prototype.render = function (code, file, options) {
        var writeFile = Promise.promisify(fs.writeFile);
        var exec = Promise.promisify(childProcess.exec);
        var render = function (options) {
            return exec(options.binaryPath
                + ' -o ' + options.outputFile
                + ' --colorscheme=' + options.colorScheme
                + ' ' + options.inputFile);
        };
        var _options = _.merge({
            binaryPath: '/usr/bin/openscad',
            viewAll: true,
            autoCenter: true
        }, options);
        if (!code && file) {
            _options.inputFile = file;
            return render(_options);
        }
        else if (code) {
            var tmpFile_1 = '/tmp/' + (path.basename(file) || 'scad-parser_tmp.scad');
            return writeFile(tmpFile_1, 'utf8')
                .then(function () {
                _options.inputFile = tmpFile_1;
                return render(_options);
            });
        }
    };
    /**
     * Parse the abstract syntax tree
     *
     *
     *
     *
     */
    SCADParser.prototype.parseAST = function (file, code) {
        if (code === void 0) { code = ''; }
        if (code !== '') {
            this.codeCache[file] = code;
            this.cache[file] = this.parse(code, file);
        }
        else {
            var code_1 = fs.readFileSync(file, 'utf8');
            this.codeCache[file] = code_1;
            this.cache[file] = this.parse(code_1, file);
        }
        return this.cache[file];
    };
    SCADParser.prototype.findTokens = function (value, type, file) {
        if (value === void 0) { value = ''; }
        if (type === void 0) { type = ''; }
        var find = {};
        if (value !== '')
            find.value = value;
        if (type !== '')
            find.type = type;
        return _.filter(this.tokenCache[file], find);
    };
    SCADParser.prototype.getToken = function (column, line, file) {
        var out = null;
        _.each(this.tokenCache[file], function (token) {
            if (line == token.line &&
                (column >= token.col && column < (token.col + token.size))) {
                out = token;
                return false;
            }
        });
        return out;
    };
    /**
     * Get an except of the code file
     *
     *
     *
     *
     *
     *
     *
     */
    SCADParser.prototype.getCodeExcerpt = function (file, location, lines) {
        if (lines === void 0) { lines = 3; }
        var code = this.codeCache[file].split('\n');
        var start = location.line - (lines + 2);
        if (start < 0)
            start = 0;
        var end = location.line + (lines - 1);
        if (end >= code.length)
            end = code.length - 1;
        code = code.slice(start, location.line + (lines - 1));
        function pad(n, width) {
            var nStr = n.toString();
            return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join('0') + nStr;
        }
        function drawMarker(indent) {
            return _.times(indent, function () { return ' '; }).join('') + _.times(location.column + 1, function () { return ' '; }).join('')
                + '^' + _.times(location.size - 2, function () { return '-'; }).join('') + '^';
        }
        return _.map(code, function (line, index) {
            if (index != location.line - 1)
                return pad(index + start + 1, end.toString().length) + ": " + line;
            else
                return pad(index + start + 1, end.toString().length) + ": " + line + "\n" + drawMarker(end.toString().length);
        }).join('\n');
    };
    return SCADParser;
}());
exports.default = SCADParser;
//# sourceMappingURL=index.js.map