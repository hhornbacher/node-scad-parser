/**
 * Prepare and initialize tokens to be used in the grammar
 * @module nearley/tokens
 */
const _ = require('lodash');

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

registerTokens(require('./state-start'));
registerTokens(require('./state-comment'));
