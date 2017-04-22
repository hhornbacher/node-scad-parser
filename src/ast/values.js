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
     * @param {Token} token The lexed token from moo
     * @param {number} value The value
     */
    class NumberValue extends Number {
        constructor(token, value) {
            super(parseFloat(value));
            this.location = new Location(token);
        }
    }
    registerClass(NumberValue);

    /**
     * Boolean type
     * 
     * @class BooleanValue
     * @extends {Boolean}
     * 
     * @param {Token} token The lexed token from moo
     * @param {boolean} value The value
     */
    class BooleanValue extends Boolean {
        constructor(token, value) {
            super(value);
            this.location = new Location(token);
        }
    }
    registerClass(BooleanValue);

    /**
     * String type
     * 
     * @class StringValue
     * @extends {String}
     * 
     * @param {Token} token The lexed token from moo
     * @param {string} value The value
     */
    class StringValue extends String {
        constructor(token, value) {
            super(value);
            this.location = new Location(token);
        }
    }
    registerClass(StringValue);

    /**
     * Vector type
     * 
     * @class VectorValue
     * 
     * @param {Token} token The lexed token from moo
     * @param {array} value The value
     */
    class VectorValue {
        constructor(token, value) {
            this.location = new Location(token);
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
     * @param {Token} token The lexed token from moo
     * @param {NumberValue} start Start of the range
     * @param {NumberValue} end End of the range
     * @param {NumberValue} [increment=new NumberValue(1)] Increment step size (default: `0`)
     */
    class RangeValue {
        constructor(token, start, end, increment = new NumberValue(1)) {
            this.location = new Location(token);
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
     * @param {Token} token The lexed token from moo
     * @param {any} reference The referenced identifier
     * @param {boolean} [negative=false] Negativity flag
     */
    class ReferenceValue {
        constructor(token, reference, negative = false) {
            this.location = new Location(token);
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