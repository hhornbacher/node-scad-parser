"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Prepare and initialize tokens to be used in the grammar
 *
 */
var _ = require("lodash");
var tokens = {
    include: { match: /include\s*<(.+)>/, lineBreaks: true },
    use: { match: /use\s*<(.+)>/, lineBreaks: true },
    moduleDefinition: { match: /module\s*([A-Za-z_$][A-Za-z0-9_]*)\s*\(/, lineBreaks: true },
    functionDefinition: { match: /function\s*([A-Za-z_$][A-Za-z0-9_]*)\s*\(/, lineBreaks: true },
    actionCall: { match: /([!#\*\%]?[A-Za-z][A-Za-z0-9_]*)\s*\(/, lineBreaks: true },
    comment: { match: /\/\/(.*)\n/, lineBreaks: true },
    mlComment: { match: /\/\*([^]*?)\*\//, lineBreaks: true },
    comma: ',',
    seperator: ':',
    lvect: '[',
    rvect: ']',
    lparent: '(',
    rparent: ')',
    lblock: '{',
    rblock: '}',
    bool: [
        'true',
        'false'
    ],
    operator1: /\*|\/|\%/,
    operator2: /\+|\-/,
    operator3: /<|<=|==|!=|>=|>|&&|\|\|/,
    assign: '=',
    identifier: /[A-Za-z_$][A-Za-z0-9_]*/,
    string: /"([^"]*)"/,
    float: /([0-9]+(?:\.?[0-9]*(?:[eE][-+]?[0-9]+)?)?)/,
    eol: { match: /\n/, lineBreaks: true },
    eos: /[ \t]*;/,
    whitespace: /[ \t]+/,
    LexerError: require('moo').error
};
exports.tokens = tokens;
var tokenRules = _.transform(tokens, function (rules, value, key) {
    if (value instanceof Array) {
        var keywords = value;
        _.each(keywords, function (keyword) {
            // add tester functions for each
            rules[key + '_' + keyword] = {
                test: function (tok) {
                    return tok.type === key && tok.value === keyword;
                }
            };
        });
    }
    // add tester function for `key`
    rules[key] = { test: function (tok) { return tok.type === key; } };
}, {});
exports.tokenRules = tokenRules;
//# sourceMappingURL=tokens.js.map