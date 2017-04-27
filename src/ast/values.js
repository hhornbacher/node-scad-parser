/**
 * Value types of the scad language
 * @module ast/values
 */
const _ = require('lodash');

function Values(registerClass) {

    /**
     * Number type
     * 
     * @class NumberValue
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {number} value The value
     */
    class NumberValue {
        constructor(tokens, value) {
            this.tokens = tokens;
            this.value = parseFloat(value);
        }

        setNegative(neg) {
            if(this.value > 0 && neg)
                this.value *= -1;
            return this;
        }

        isEqual(value) {
            if (
                value.constructor.name === 'NumberValue' 
                && this.value === value.value
                )
                return true;
            return false;
        }

        toString() {
            return this.value.toString();
        }
    }
    registerClass(NumberValue);

    /**
     * Boolean type
     * 
     * @class BooleanValue
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {boolean} value The value
     */
    class BooleanValue {
        constructor(tokens, value) {
            this.tokens = tokens;
            this.value = value;
        }

        isEqual(value) {
            if (
                value.constructor.name === 'BooleanValue'
                && this.value === value.value
            )
                return true;
            return false;
        }

        toString() {
            return this.value.toString();
        }
    }
    registerClass(BooleanValue);

    /**
     * String type
     * 
     * @class StringValue
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {string} value The value
     */
    class StringValue {
        constructor(tokens, value) {
            this.tokens = tokens;
            this.value = value;
        }

        isEqual(value) {
            if (
                value.constructor.name === 'StringValue'
                && this.value === value.value
            )
                return true;
            return false;
        }

        toString() {
            return this.value.toString();
        }
    }
    registerClass(StringValue);

    /**
     * Vector type
     * 
     * @class VectorValue
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {array} value The value
     */
    class VectorValue {
        constructor(tokens, value) {
            this.tokens = tokens;
            this.value = value;
            this.negative=false;
        }

        setNegative(neg) {
            this.negative = neg;
            return this;
        }

        isEqual(value) {
            if (
                value.constructor.name === 'VectorValue'
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
            return this.value.toString();
        }
    }
    registerClass(VectorValue);

    /**
     * Range type
     * 
     * @class RangeValue
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {NumberValue} start Start of the range
     * @param {NumberValue} end End of the range
     * @param {NumberValue} [increment=new NumberValue(1)] Increment step size (default: `0`)
     */
    class RangeValue {
        constructor(tokens, start, end, increment = new NumberValue(null, 1)) {
            this.tokens = tokens;
            this.start = start;
            this.end = end;
            this.increment = increment;
        }

        isEqual(value) {
            if (
                value.constructor.name === 'RangeValue'
                && this.start.isEqual(value.start)
                && this.end.isEqual(value.end)
                && this.increment.isEqual(value.increment)
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
            return `[${this.start.toString()}:${this.increment.toString()}:${this.end.toString()}]`;
        }
    }
    registerClass(RangeValue);

    /**
     * Reference type
     * 
     * @class ReferenceValue
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {any} reference The referenced identifier
     * @param {boolean} [negative=false] Negativity flag
     */
    class ReferenceValue {
        constructor(tokens, reference) {
            this.tokens = tokens;
            this.negative = false;
            this.reference = reference;
        }

        isEqual(value) {
            if (
                value.constructor.name === 'RangeValue'
                && this.negative === value.negative
                && this.reference === value.reference
            )
                return true;
            return false;
        }

        /**
         * Turn this value negative
         * 
         * @param {Boolean} neg 
         * @returns {ReferenceValue} this
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
            return `${this.negative ? '- ' : ''}${this.reference}`;
        }
    }
    registerClass(ReferenceValue);
};

module.exports = Values;