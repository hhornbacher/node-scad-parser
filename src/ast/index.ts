/**
 * Abstract syntax representation of the scad language
 */

import { Token } from '../nearley/tokens';

/**
 * Values
 */
export * from './values';

/**
 * Syntax nodes
 */
export * from './nodes';

/**
 * A Location in the code
 */
export class Location {
    offset: number;
    size: number;
    lineBreaks: number;
    line: number;
    column: number;

    constructor(token: Token) {
        let { offset, size, lineBreaks, line, col } = token || { offset: 0, size: 0, lineBreaks: 0, line: 1, col: 1 };
        this.offset = offset;
        this.size = size;
        this.lineBreaks = lineBreaks;
        this.line = line;
        this.column = col;
    }

    toString() {
        return `[Location: Offset=${this.offset}, Size=${this.size}, lineBreaks=${this.lineBreaks}, Line=${this.line}, Column=${this.column}]`;
    }
}

