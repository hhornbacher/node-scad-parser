/**
 * Prepare and initialize tokens to be used in the grammar
 * @module nearley/tokens
 */
import * as _ from 'lodash';

export interface Token {
    type: string;
    value: string;
    toString: Function;
    offset: number;
    size: number;
    lineBreaks: number;
    line: number;
    col: number;
}

export const tokens = {
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
    string: /"([^"]*)"/,
    float: /([0-9]+(?:\.?[0-9]*(?:[eE][-+]?[0-9]+)?)?)/,
    eol: { match: /\n/, lineBreaks: true },
    eos: /[ \t]*;/,
    whitespace: /[ \t]+/,
    LexerError: require('moo').error
}

export let tokenRules: any = _.each(tokens, (value, key) => {
    if (value instanceof Array || value.value instanceof Array) {
        const keywords = value;
        _.each(keywords, (keyword) => {
            // add tester functions for each
            tokenRules[key + '_' + keyword] = {
                test: (tok: any) =>
                    tok.type === key && tok.value === keyword
            };
        });
    }

    // add tester function for `key`
    tokenRules[key] = { test: (tok: any) => tok.type === key }
});;

