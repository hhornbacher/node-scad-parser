/// <reference types="node" />
import { Token } from './nearley/tokens';
import { RootNode, Location } from './ast';
/**
 * Parser for OpenSCAD code
 *
 */
export default class SCADParser {
    private ignoredTokens;
    private results;
    private cache;
    private codeCache;
    private tokenCache;
    private lexer;
    constructor();
    static repl(context?: {
        [key: string]: any;
    }): void;
    /**
     * Parse the supplied code
     *
     */
    parse(code: string, file: string): RootNode;
    /**
     * Render the supplied code (with OpenSCAD)
     *
     */
    render(code: string | null, file: string | null, options?: any): Promise<string | Buffer>;
    /**
     * Parse the abstract syntax tree
     *
     */
    parseAST(file: string, code?: string): RootNode;
    findTokens(value: string | undefined, type: string | undefined, file: any): Array<Token>;
    getToken(column: number, line: number, file: string): Token | null;
    /**
     * Get an except of the code file
     *
     */
    getCodeExcerpt(file: string, location: Location, lines?: number): string;
}
