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
declare const tokens: {
    [key: string]: string | Array<string> | {
        match: RegExp;
        lineBreaks: boolean;
    } | RegExp;
};
export declare type TokenRules = {
    [key: string]: {
        test: (tok: any) => boolean;
    };
};
declare const tokenRules: TokenRules;
export { Token, tokens, tokenRules };
