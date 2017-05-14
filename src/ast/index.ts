/**
 * Abstract syntax representation of the scad language
 *
 */
/*import * as _ from 'lodash';
import { inspect } from 'util';*/

import { Token } from '../nearley/tokens';

export * from './values';
export * from './nodes';

/**
 * Location in the code
 * 
 *
 * 
 *
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

