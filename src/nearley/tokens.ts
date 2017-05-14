/**
 * Prepare and initialize tokens to be used in the grammar
 *
 */
import * as _ from "lodash";

interface Token {
    type: string;
    value: string;
    toString: Function;
    offset: number;
    size: number;
    lineBreaks: number;
    line: number;
    col: number;
}

const tokens: { [key: string]: string | Array<string> | { match: RegExp, lineBreaks: boolean } | RegExp } = {
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

export type TokenRules = { [key: string]: { test: (tok: any) => boolean } };

const tokenRules: TokenRules = _.transform(tokens, (rules, value, key) => {
    if (value instanceof Array) {
        const keywords = value;
        _.each(keywords, (keyword) => {
            // add tester functions for each
            rules[key + '_' + keyword] = {
                test: (tok: any) =>
                    tok.type === key && tok.value === keyword
            };
        });
    }
    // add tester function for `key`
    rules[key] = { test: (tok: any) => tok.type === key }
}, {} as TokenRules);

export {
    Token, tokens, tokenRules
};
