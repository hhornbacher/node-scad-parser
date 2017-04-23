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
     * @extends {Number}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {number} value The value
     */
    class NumberValue extends Number {
        constructor(tokens, value) {
            super(parseFloat(value));
            this.tokens = tokens;
        }
    }
    registerClass(NumberValue);

    /**
     * Boolean type
     * 
     * @class BooleanValue
     * @extends {Boolean}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {boolean} value The value
     */
    class BooleanValue extends Boolean {
        constructor(tokens, value) {
            super(value);
            this.tokens = tokens;
        }
    }
    registerClass(BooleanValue);

    /**
     * String type
     * 
     * @class StringValue
     * @extends {String}
     * 
     * @param {Array.Token} tokens The lexed tokens from moo
     * @param {string} value The value
     */
    class StringValue extends String {
        constructor(tokens, value) {
            super(value);
            this.tokens = tokens;
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
        constructor(tokens, reference, negative = false) {
            this.tokens = tokens;
            this.negative = negative;
            this.reference = reference;
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