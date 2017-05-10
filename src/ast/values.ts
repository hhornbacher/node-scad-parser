/**
 * Value types of the scad language
 * @module ast/values
 */
import * as _ from 'lodash';
import { Token } from '../nearley/tokens';


/**
 * Base value class
 * 
 * @class Value
 */
export class Value implements Value {
    tokens: Array<Token>;
    value: any;
    className: string;

    constructor(tokens: Array<Token>, value: any) {
        this.tokens = tokens;
        this.value = value;
        let instance: any = this.constructor;
        this.value = instance.name;
    }

    /**
     * Check if values are equal
     * 
     * @param {any} value Value to compare with this
     * @returns {boolean}
     */
    isEqual(value: Value) {
        if (
            typeof value === typeof this
            && this.value === value.value
        )
            return true;
        return false;
    }

    /**
     * Get the string representation of this object
     * 
     * @returns {string}
     */
    toString() {
        return `${this.value}`;
    }

    toCode() {
        return `${this.value}`;
    }
}

export class SignedValue extends Value {
    negative: Boolean = false;

    constructor(tokens: Array<Token>, value: any) {
        super(tokens, value);

        let instance: any = this.constructor;
        this.value = instance.name;
    }

    /**
     * (Un-)Set the negative flag for this value
     * 
     * @param {boolean} negative True if this value is negative
     * @returns {Value} this
     */
    setNegative(negative: Boolean) {
        this.negative = negative;
        return this;
    }

    /**
     * Get the string representation of this object
     * 
     * @returns {string}
     */
    toString() {
        return `${this.negative ? '-' : ''}${this.value}`;
    }

    toCode() {
        return `${this.negative ? '-' : ''}${this.value}`;
    }
}

/**
 * Number type
 * 
 * @class NumberValue
 * @extends {Value}
 * 
 * @param {Array.Token} tokens The lexed tokens from moo
 * @param {number} value The value
 */
export class NumberValue extends SignedValue {
}


/**
 * Boolean type
 * 
 * @class BooleanValue
 * @extends {Value}
 * 
 * @param {Array.Token} tokens The lexed tokens from moo
 * @param {boolean} value The value
 */
export class BooleanValue extends Value {
}


/**
 * String type
 * 
 * @class StringValue
 * @extends {Value}
 * 
 * @param {Array.Token} tokens The lexed tokens from moo
 * @param {string} value The value
 */
export class StringValue extends Value {
    toCode() {
        return `"${this.value}"`;
    }
}


/**
 * Vector type
 * 
 * @class VectorValue
 * @extends {Value}
 * 
 * @param {Array.Token} tokens The lexed tokens from moo
 * @param {array} value The value
 */
export class VectorValue extends Value {
    /**
     * Check if values are equal
     * 
     * @param {any} value Value to compare with this
     * @returns {boolean}
     */
    isEqual(value: Value) {
        let out = false;
        if (value instanceof VectorValue) {
            out = this.value.length > 0;
            _.each(this.value, (val, key) => {
                if (!val.isEqual(value.value[key])) {
                    out = false;
                    return false;
                }
            });
        }
        return out;
    }

    toString() {
        return `[${_.map(this.value, (value: Value) => value.toString()).join(', ')}]`;
    }

    toCode() {
        return `[${_.map(this.value, (value: Value) => value.toCode()).join(', ')}]`;
    }
}


/**
 * Range type
 * 
 * @class RangeValue
 * @extends {Value}
 * 
 * @param {Array.Token} tokens The lexed tokens from moo
 * @param {NumberValue} start Start of the range
 * @param {NumberValue} end End of the range
 * @param {NumberValue} [increment=new NumberValue(1)] Increment step size (default: `0`)
 */
export class RangeValue extends Value {
    start: Value;
    end: Value;
    increment: Value;

    constructor(tokens: Array<Token>, start: Value, end: Value, increment = new NumberValue([], 1)) {
        super(tokens, null);
        this.start = start;
        this.end = end;
        this.increment = increment;
    }

    /**
     * Check if values are equal
     * 
     * @param {any} value Value to compare with this
     * @returns {boolean}
     */
    isEqual(value: Value) {
        if (
            value instanceof RangeValue
            && this.start.isEqual(value.start)
            && this.end.isEqual(value.end)
            && this.increment.isEqual(value.increment)
        )
            return true;
        return false;
    }

    toString() {
        return `[${this.start.toString()}:${this.increment.toString()}:${this.end.toString()}]`;
    }

    toCode() {
        return `[${this.start.toCode()}:${this.increment.toCode()}:${this.end.toCode()}]`;
    }
}


/**
 * Reference type
 * 
 * @class ReferenceValue
 * @extends {Value}
 * 
 * @param {Array.Token} tokens The lexed tokens from moo
 * @param {any} reference The referenced identifier
 */
export class ReferenceValue extends SignedValue {
    reference: string;

    constructor(tokens: Array<Token>, reference: string) {
        super(tokens, null);
        this.reference = reference;
    }

    /**
     * Check if values are equal
     * 
     * @param {any} value Value to compare with this
     * @returns {boolean}
     */
    isEqual(value: Value) {
        if (
            value instanceof ReferenceValue
            && this.negative === value.negative
            && this.reference === value.reference
        )
            return true;
        return false;
    }

    /**
     * Get the string representation of this object
     * 
     * @returns {string}
     */
    toString() {
        return `${this.negative ? '-' : ''}${this.reference}`;
    }

    toCode() {
        return `${this.negative ? '-' : ''}${this.reference}`;
    }
}
