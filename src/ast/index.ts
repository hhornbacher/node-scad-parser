/**
 * Abstract syntax representation of the scad language
 * @module ast
 */
import * as _ from 'lodash';
import {inspect} from 'util';

export * from './values';
export * from './nodes';

/**
 * Location in the code
 * 
 * @class Location
 * 
 * @param {Token} token The token from which to get the positional information
 */
export class Location {
    offset: Number;
    size: Number;
    lineBreaks: Number;
    line: Number;
    column: Number;

    constructor(token = { offset:0, size:0, lineBreaks:0, line:1, col:1 }) {
        let { offset, size, lineBreaks, line, col } = token;
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

