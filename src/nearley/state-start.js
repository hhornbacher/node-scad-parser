const moo = require('moo');

module.exports = {
    lcomment: {match: /\/\*\s*/, push: 'comment', lineBreaks: true},
    eos: /[ \t]*;/,
    eol: { match: /\n/, lineBreaks: true },
    comment: { match: /\/\/(.*)\n/, lineBreaks: true },
    whitespace: /[ \t]+/,
    keyword: [
        'include',
        'use',
        'function',
        'module',
        'true',
        'false'
    ],
    modifier: /[!#\*%]/,
    comma: ',',
    positive: '+',
    negative: '-',
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
    float: /[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?/,
    path: /[\w\.\/]+\.scad/,
    identifier: /[A-Za-z_$][A-Za-z0-9_]*/,
    myError: moo.error
}