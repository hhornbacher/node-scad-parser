/**
 * Lexer state: Start (Default state)
 * @module nearley/state-start
 */
const moo = require('moo');

module.exports = {
    include: {match: /include\s*<(.+)>/, lineBreaks: true},
    use: {match: /use\s*<(.+)>/, lineBreaks: true},
    moduleDefinition: {match: /module\s*([A-Za-z_$][A-Za-z0-9_]*)\s*\(/, lineBreaks: true},
    functionDefinition: {match: /function\s*([A-Za-z_$][A-Za-z0-9_]*)\s*\(/, lineBreaks: true},
    actionCall: {match: /([!#\*\%]?[A-Za-z][A-Za-z0-9_]*)\s*\(/, lineBreaks: true},
    comment: { match: /\/\/(.*)\n/, lineBreaks: true },
    mlComment: {match: /\/\*([^]*?)\*\//, lineBreaks: true},
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
    LexerError: moo.error
}