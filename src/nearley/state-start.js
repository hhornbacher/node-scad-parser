/**
 * Lexer state: Start (Default state)
 * @module nearley/state-start
 */
const moo = require('moo');

module.exports = {
    include: {match: /include\s*<(.+)>/, lineBreaks: true},
    use: {match: /use\s*<(.+)>/, lineBreaks: true},
    comment: { match: /\/\/(.*)\n/, lineBreaks: true },
    lcomment: {match: /\/\*\s*/, push: 'comment', lineBreaks: true},
    keyword: [
        'function',
        'module',
        'true',
        'false'
    ],
    comma: ',',
    identifier: /[A-Za-z_$][A-Za-z0-9_]*|[!#\*\%][A-Za-z][A-Za-z0-9_]*/,
    operator1: /\*|\/|\%/,
    operator2: /\+|\-/,
    operator3: /<|<=|==|!=|>=|>|&&|\|\|/,
    assign: '=',
    seperator: ':',
    lvect: '[',
    rvect: ']',
    lparent: '(',
    rparent: ')',
    lblock: '{',
    rblock: '}',
    string: /"[^"]*"/,
    float: /([0-9]+(?:\.?[0-9]*(?:[eE][-+]?[0-9]+)?)?)/,
    eol: { match: /\n/, lineBreaks: true },
    eos: /[ \t]*;/,
    whitespace: /[ \t]+/,
    LexerError: moo.error
}