/**
 * Lexer state: Multiline comment
 * @module nearley/state-comment
 */
const moo = require('moo');

module.exports = {
    rcomment: {match: '*/', pop: 1},
    icomment: {match: /[^]+/, lineBreaks: true}
}