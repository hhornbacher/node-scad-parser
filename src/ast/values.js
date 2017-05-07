/**
 * Value types of the scad language
 * @module ast/values
 */
const _ = require('lodash');

function Values(registerClass) {

    /**
     * Base value class
     * 
     * @class BaseValue
     */
    class BaseValue {
        constructor(tokens, value, negative = false) {
            this.tokens = tokens;
            this.value = value;
            this.negative = negative;
        }

        /**
         * Check if values are equal
         * 
         * @param {any} value Value to compare with this
         * @returns {boolean}
         */
        isEqual(value) {
            if (
                value.constructor.name === this.constructor.name
                && this.negative === value.negative
                && this.value === value.value
            )
                return true;
            return false;
        }

        /**
         * (Un-)Set the negative flag for this value
         * 
         * @param {boolean} neg True if this value is negative
         * @returns {BaseValue} this
         */
        setNegative(neg) {
            this.negative = neg;
            return this;
        }

        /**
         * Get the string representation of this object
         * 
         * @returns {string}
         */
        toString() {
            return `${this.negative ? '- ' : ''}${this.value}`;
        }

        toCode() {
            return `${this.negative ? '-' : ''}${this.value}`;
        }
    }

    /**
     * Number type
     * 
     * @class NumberValue
     * @extends {BaseValue}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {number} value The value
     */
    class NumberValue extends BaseValue {
        constructor(tokens, value) {
            super(tokens, parseFloat(value));
        }
    }
    registerClass(NumberValue);

    /**
     * Boolean type
     * 
     * @class BooleanValue
     * @extends {BaseValue}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {boolean} value The value
     */
    class BooleanValue extends BaseValue {
    }
    registerClass(BooleanValue);

    /**
     * String type
     * 
     * @class StringValue
     * @extends {BaseValue}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {string} value The value
     */
    class StringValue extends BaseValue {
        toCode() {
            return `"${this.value}"`;
        }
    }
    registerClass(StringValue);

    /**
     * Vector type
     * 
     * @class VectorValue
     * @extends {BaseValue}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {array} value The value
     */
    class VectorValue extends BaseValue {
        /**
         * Check if values are equal
         * 
         * @param {any} value Value to compare with this
         * @returns {boolean}
         */
        isEqual(value) {
            let out = false;
            if (value.constructor.name === 'VectorValue') {
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
            return `[${_.map(this.value, value => value.toString()).join(', ')}]`;
        }

        toCode() {
            return `[${_.map(this.value, value => value.toCode()).join(', ')}]`;
        }
    }
    registerClass(VectorValue);

    /**
     * Range type
     * 
     * @class RangeValue
     * @extends {BaseValue}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {NumberValue} start Start of the range
     * @param {NumberValue} end End of the range
     * @param {NumberValue} [increment=new NumberValue(1)] Increment step size (default: `0`)
     */
    class RangeValue extends BaseValue {
        constructor(tokens, start, end, increment = new NumberValue(null, 1)) {
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
        isEqual(value) {
            if (
                value.constructor.name === 'RangeValue'
                && this.negative === value.negative
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
    registerClass(RangeValue);

    /**
     * Reference type
     * 
     * @class ReferenceValue
     * @extends {BaseValue}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {any} reference The referenced identifier
     */
    class ReferenceValue extends BaseValue {
        constructor(tokens, reference) {
            super(tokens, null);
            this.reference = reference;
        }

        /**
         * Check if values are equal
         * 
         * @param {any} value Value to compare with this
         * @returns {boolean}
         */
        isEqual(value) {
            if (
                value.constructor.name === 'ReferenceValue'
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
            return `${this.negative ? '- ' : ''}${this.reference}`;
        }

        toCode() {
            return `${this.negative ? '-' : ''}${this.reference}`;
        }
    }
    registerClass(ReferenceValue);
};

module.exports = Values;