/**
 * Abstract syntax representation of the scad language
 *
 */
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
export declare class Location {
    offset: number;
    size: number;
    lineBreaks: number;
    line: number;
    column: number;
    constructor(token: Token);
    toString(): string;
}
