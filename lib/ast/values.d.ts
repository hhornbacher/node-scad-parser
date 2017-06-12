import { Token } from '../nearley/tokens';
/**
 * Base value class
 *
 */
export declare class Value<ValueType> {
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
    isEqual(value: GenericValue): boolean;
    /**
     * Get the string representation of this object
     *
     *
     */
    toString(): string;
    toCode(): string;
}
export declare type GenericValue = Value<any>;
export declare class SignedValue<ValueType> extends Value<ValueType> {
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
export declare class NumberValue extends SignedValue<number> {
    constructor(tokens: Array<Token>, value: number);
}
/**
 * Boolean type
 *
 */
export declare class BooleanValue extends Value<boolean> {
    constructor(tokens: Array<Token>, value: boolean);
}
/**
 * String type
 *
 */
export declare class StringValue extends Value<string> {
    constructor(tokens: Array<Token>, value: string);
    toCode(): string;
}
/**
 * Vector type
 *
 */
export declare class VectorValue extends Value<Array<GenericValue>> {
    constructor(tokens: Array<Token>, value: Array<GenericValue>);
    /**
     * Check if values are equal
     *
     */
    isEqual(value: GenericValue): boolean;
    toString(): string;
    toCode(): string;
}
/**
 * Range type
 *
 */
export declare class RangeValue extends Value<any> {
    start: Value<number>;
    end: Value<number>;
    increment: Value<number>;
    constructor(tokens: Array<Token>, start: Value<number>, end: Value<number>, increment?: Value<number>);
    /**
     * Check if values are equal
     *
     */
    isEqual(value: GenericValue): boolean;
    toString(): string;
    toCode(): string;
}
/**
 * Reference type
 *
 */
export declare class ReferenceValue extends SignedValue<any> {
    constructor(tokens: Array<Token>, reference: string);
    /**
     * Check if values are equal
     *
     */
    isEqual(value: GenericValue): boolean;
}
