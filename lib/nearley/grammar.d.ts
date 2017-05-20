export declare type Info = any;
export interface Token {
    value: any;
    [key: string]: any;
}
export interface Lexer {
    reset: (chunk: string, info: Info) => void;
    next: () => Token;
    save: () => Info;
    formatError: (token: Token) => string;
    has: (tokenType: string) => boolean;
}
export interface NearleyGrammar {
    ParserRules: NearleyRule[];
    ParserStart: string;
    Lexer: Lexer | undefined;
}
export interface NearleyRule {
    name: string;
    symbols: NearleySymbol[];
    postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}
export declare type NearleySymbol = string | {
    literal: any;
} | {
    test: (token: any) => boolean;
};
export declare var grammar: NearleyGrammar;
