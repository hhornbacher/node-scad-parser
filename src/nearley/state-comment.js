const moo = require('moo');

module.exports = {
    rcomment: {match: '*/', pop: 1},
    icomment: {match: /[^]+/, lineBreaks: true}
}