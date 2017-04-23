/**
 * Prepare and initialize tokens to be used in the grammar
 * @module nearley/tokens
 */
const _ = require('lodash');


/**
 * Register token definitions globally for use in the grammar definition
 * @param {Object} tokens Token difinitions 
 */
const registerTokens = (tokens) => {
    _.each(tokens, (value, key) => {
        if (value instanceof String)
            value = [value]

        if (value instanceof Array || value.value instanceof Array) {
            // we've got ourselves a keyword array!
            const keywords = value instanceof Array ? value : value.value

            _.each(keywords, (keyword) => {
                // add tester functions for each
                global[key + '_' + keyword] = {
                    test: tok =>
                        tok.type === key && tok.value === keyword
                }
            });
        }

        // add tester function for `key`
        global[key] = { test: tok => tok.type === key }
    });
}

const tokens = {
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
    string: /"[^"]*"/,
    float: /([0-9]+(?:\.?[0-9]*(?:[eE][-+]?[0-9]+)?)?)/,
    eol: { match: /\n/, lineBreaks: true },
    eos: /[ \t]*;/,
    whitespace: /[ \t]+/,
    LexerError: require('moo').error
}

module.exports = () => registerTokens(tokens);
module.exports.tokens = tokens;
