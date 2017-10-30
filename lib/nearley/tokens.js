"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Prepare and initialize tokens to be used in the grammar
 *
 */
const _ = require("lodash");
const tokens = {
    include: { match: /include\s*<(.+)>/, lineBreaks: true },
    use: { match: /use\s*<(.+)>/, lineBreaks: true },
    ifToken: 'if',
    elseToken: 'else',
    moduleDefinition: { match: /module\s*([A-Za-z_$][A-Za-z0-9_]*)\s*\(/, lineBreaks: true },
    functionDefinition: { match: /function\s*([A-Za-z_$][A-Za-z0-9_]*)\s*\(/, lineBreaks: true },
    forLoopDefinition: { match: /for\s*\(/, lineBreaks: true },
    intersectionForLoopDefinition: { match: /intersection_for\s*\(/, lineBreaks: true },
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
const tokenRules = _.transform(tokens, (rules, value, key) => {
    if (value instanceof Array) {
        const keywords = value;
        _.each(keywords, (keyword) => {
            // add tester functions for each
            rules[key + '_' + keyword] = {
                test: (tok) => tok.type === key && tok.value === keyword
            };
        });
    }
    // add tester function for `key`
    rules[key] = { test: (tok) => tok.type === key };
}, {});
exports.tokenRules = tokenRules;
//# sourceMappingURL=tokens.js.map