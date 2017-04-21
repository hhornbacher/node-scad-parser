const moo = require('moo');

module.exports = {
    comment: { match: /\/\/(.*)\n/, lineBreaks: true },
    lcomment: {match: /\/\*\s*/, push: 'comment', lineBreaks: true},
    eol: { match: /\n/, lineBreaks: true },
    eos: /[ \t]*;/,
    whitespace: /[ \t]+/,
    keyword: [
        'include',
        'use',
        'function',
        'module',
        'true',
        'false'
    ],
    comma: ',',
    operator1: /\*|\/|\%/,
    operator2: /\+|\-/,
    operator3: /<|<=|==|!=|>=|>|&&|\|\|/,
    assign: '=',
    seperator: ':',
    lvect: '[',
    rvect: ']',
    lpath: '<',
    rpath: '>',
    lparent: '(',
    rparent: ')',
    lblock: '{',
    rblock: '}',
    string: /"[^"]*"/,
    float: /([0-9]+(?:\.?[0-9]*(?:[eE][-+]?[0-9]+)?)?)/,
    path: /[\w\.\/]+\.scad/,
    identifier: /[A-Za-z_$!#\*%][A-Za-z0-9_]*/,
    myError: moo.error
}