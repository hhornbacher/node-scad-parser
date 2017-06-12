/**
 * Value types of the scad language
 * 
 */
import * as _ from 'lodash';
import { Token } from '../nearley/tokens';


/**
 * Base value class
 * 
 */
export class Value<ValueType> {
    tokens: Array<Token>;
    value: ValueType;
    className: string;

    constructor(tokens: Array<Token>, value: ValueType) {
        this.tokens = tokens;
        this.value = value;
    }

    /**
     * Check if values are equal
     * 
     *
     *
     */
    isEqual(value: GenericValue) {
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
     *
     */
    toString() {
        return `${this.value}`;
    }

    toCode() {
        return `${this.value}`;
    }
}

export type GenericValue = Value<any>;

export class SignedValue<ValueType> extends Value<ValueType> {
    negative: boolean = false;

    constructor(tokens: Array<Token>, value: ValueType) {
        super(tokens, value);
    }

    /**
     * (Un-)Set the negative flag for this value
     * 
     *
     *
     */
    setNegative(negative: boolean) {
        this.negative = negative;
        return this;
    }

    /**
     * Get the string representation of this object
     * 
     *
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
 */
export class NumberValue extends SignedValue<number> {
    constructor(tokens: Array<Token>, value: number) {
        super(tokens, value);
        let instance: any = this.constructor;
        this.className = instance.name;
    }
}


/**
 * Boolean type
 * 
 */
export class BooleanValue extends Value<boolean> {
    constructor(tokens: Array<Token>, value: boolean) {
        super(tokens, value);
        let instance: any = this.constructor;
        this.className = instance.name;
    }
}


/**
 * String type
 * 
 */
export class StringValue extends Value<string> {
    constructor(tokens: Array<Token>, value: string) {
        super(tokens, value);
        let instance: any = this.constructor;
        this.className = instance.name;
    }

    toCode() {
        return `"${this.value}"`;
    }
}


/**
 * Vector type
 * 
 */
export class VectorValue extends Value<Array<GenericValue>> {
    constructor(tokens: Array<Token>, value: Array<GenericValue>) {
        super(tokens, value);
        let instance: any = this.constructor;
        this.className = instance.name;
    }

    /**
     * Check if values are equal
     * 
     */
    isEqual(value: GenericValue) {
        let out = false;
        if (value instanceof VectorValue) {
            out = (this.value as Array<GenericValue>).length > 0;
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
        return `[${_.map((this.value as Array<GenericValue>), (value: any) => value.toString()).join(', ')}]`;
    }

    toCode() {
        return `[${_.map(this.value as any, (value: any) => value.toString()).join(', ')}]`;
    }
}


/**
 * Range type
 * 
 */
export class RangeValue extends Value<any> {
    start: Value<number>;
    end: Value<number>;
    increment: Value<number>;

    constructor(tokens: Array<Token>, start: Value<number>, end: Value<number>, increment: Value<number> = new NumberValue([], 1)) {
        super(tokens, [start, increment, end]);
        this.start = start;
        this.end = end;
        this.increment = increment;
        let instance: any = this.constructor;
        this.className = instance.name;
    }

    /**
     * Check if values are equal
     * 
     */
    isEqual(value: GenericValue) {
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
 */
export class ReferenceValue extends SignedValue<any> {
    constructor(tokens: Array<Token>, reference: string) {
        super(tokens, reference);
        let instance: any = this.constructor;
        this.className = instance.name;
    }

    /**
     * Check if values are equal
     * 
     */
    isEqual(value: GenericValue) {
        if (
            value instanceof ReferenceValue
            && this.negative === value.negative
            && this.value === value.value
        )
            return true;
        return false;
    }
}
