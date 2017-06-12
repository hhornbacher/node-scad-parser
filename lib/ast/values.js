"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Value types of the scad language
 *
 */
const _ = require("lodash");
/**
 * Base value class
 *
 */
class Value {
    constructor(tokens, value) {
        this.tokens = tokens;
        this.value = value;
    }
    /**
     * Check if values are equal
     *
     *
     *
     */
    isEqual(value) {
        if (typeof value === typeof this
            && this.value === value.value)
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
exports.Value = Value;
class SignedValue extends Value {
    constructor(tokens, value) {
        super(tokens, value);
        this.negative = false;
    }
    /**
     * (Un-)Set the negative flag for this value
     *
     *
     *
     */
    setNegative(negative) {
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
exports.SignedValue = SignedValue;
/**
 * Number type
 *
 */
class NumberValue extends SignedValue {
    constructor(tokens, value) {
        super(tokens, value);
        let instance = this.constructor;
        this.className = instance.name;
    }
}
exports.NumberValue = NumberValue;
/**
 * Boolean type
 *
 */
class BooleanValue extends Value {
    constructor(tokens, value) {
        super(tokens, value);
        let instance = this.constructor;
        this.className = instance.name;
    }
}
exports.BooleanValue = BooleanValue;
/**
 * String type
 *
 */
class StringValue extends Value {
    constructor(tokens, value) {
        super(tokens, value);
        let instance = this.constructor;
        this.className = instance.name;
    }
    toCode() {
        return `"${this.value}"`;
    }
}
exports.StringValue = StringValue;
/**
 * Vector type
 *
 */
class VectorValue extends Value {
    constructor(tokens, value) {
        super(tokens, value);
        let instance = this.constructor;
        this.className = instance.name;
    }
    /**
     * Check if values are equal
     *
     */
    isEqual(value) {
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
        return `[${_.map(this.value, (value) => value.toString()).join(', ')}]`;
    }
    toCode() {
        return `[${_.map(this.value, (value) => value.toString()).join(', ')}]`;
    }
}
exports.VectorValue = VectorValue;
/**
 * Range type
 *
 */
class RangeValue extends Value {
    constructor(tokens, start, end, increment = new NumberValue([], 1)) {
        super(tokens, [start, increment, end]);
        this.start = start;
        this.end = end;
        this.increment = increment;
        let instance = this.constructor;
        this.className = instance.name;
    }
    /**
     * Check if values are equal
     *
     */
    isEqual(value) {
        if (value instanceof RangeValue
            && this.start.isEqual(value.start)
            && this.end.isEqual(value.end)
            && this.increment.isEqual(value.increment))
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
exports.RangeValue = RangeValue;
/**
 * Reference type
 *
 */
class ReferenceValue extends SignedValue {
    constructor(tokens, reference) {
        super(tokens, reference);
        let instance = this.constructor;
        this.className = instance.name;
    }
    /**
     * Check if values are equal
     *
     */
    isEqual(value) {
        if (value instanceof ReferenceValue
            && this.negative === value.negative
            && this.value === value.value)
            return true;
        return false;
    }
}
exports.ReferenceValue = ReferenceValue;
//# sourceMappingURL=values.js.map