/**
 * Prepare and initialize tokens to be used in the grammar
 * @module nearley/tokens
 */
const stateStart = require('./state-start'),
    stateComment = require('./state-comment');

function registerTokens(tokens) {
    // XXX: until nearley supports `.` in token identifiers this will
    //      pollute the global scope :(
    const g = global || window

    for (const key in tokens) {
        let value = tokens[key]

        if (value instanceof String)
            value = [value]

        if (value instanceof Array || value.value instanceof Array) {
            // we've got ourselves a keyword array!
            const keywords = value instanceof Array ? value : value.value

            for (let keyword of keywords) {
                // add tester functions for each
                g[key + '_' + keyword] = {
                    test: tok =>
                        tok.type === key && tok.value === keyword
                }
            }
        }

        // add tester function for `key`
        g[key] = { test: tok => tok.type === key }
    }
}

registerTokens(stateStart);
registerTokens(stateComment);
