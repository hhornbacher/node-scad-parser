import { Token } from '../nearley/tokens';
export declare type ValueType = number | string | boolean | Array<Value>;
/**
 * Base value class
 *
 */
export declare class Value {
    tokens: Array<Token>;
    value: ValueType;
    className: string;
    constructor(tokens: Array<Token>, value: ValueType);
    /**
     * Check if values are equal
     *
     *
     *
     */
    isEqual(value: Value): boolean;
    /**
     * Get the string representation of this object
     *
     *
     */
    toString(): string;
    toCode(): string;
}
export declare class SignedValue extends Value {
    negative: boolean;
    constructor(tokens: Array<Token>, value: ValueType);
    /**
     * (Un-)Set the negative flag for this value
     *
     *
     *
     */
    setNegative(negative: boolean): this;
    /**
     * Get the string representation of this object
     *
     *
     */
    toString(): string;
    toCode(): string;
}
/**
 * Number type
 *
 */
export declare class NumberValue extends SignedValue {
    constructor(tokens: Array<Token>, value: number);
}
/**
 * Boolean type
 *
 */
export declare class BooleanValue extends Value {
    constructor(tokens: Array<Token>, value: boolean);
}
/**
 * String type
 *
 */
export declare class StringValue extends Value {
    constructor(tokens: Array<Token>, value: string);
    toCode(): string;
}
/**
 * Vector type
 *
 */
export declare class VectorValue extends Value {
    constructor(tokens: Array<Token>, value: Array<Value>);
    /**
     * Check if values are equal
     *
     */
    isEqual(value: Value): boolean;
    toString(): string;
    toCode(): string;
}
/**
 * Range type
 *
 */
export declare class RangeValue extends Value {
    start: Value;
    end: Value;
    increment: Value;
    constructor(tokens: Array<Token>, start: Value, end: Value, increment?: Value);
    /**
     * Check if values are equal
     *
     */
    isEqual(value: Value): boolean;
    toString(): string;
    toCode(): string;
}
/**
 * Reference type
 *
 */
export declare class ReferenceValue extends SignedValue {
    constructor(tokens: Array<Token>, reference: string);
    /**
     * Check if values are equal
     *
     */
    isEqual(value: Value): boolean;
}
