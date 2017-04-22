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
            if (_.isString(value))
                value = parseFloat(value);
            super(value);
            _.extend(this, new SCADBaseClass());
            this.location = token ? new Location(token) : null;
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
            _.extend(this, new SCADBaseClass());
            this.location = token ? new Location(token) : null;
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
            _.extend(this, new SCADBaseClass());
            this.location = token ? new Location(token) : null;
        }
    }
    registerClass(StringValue);

    /**
     * Vector type
     * 
     * @class VectorValue
     * @extends {SCADBaseClass}
     * 
     * @param {Token} token The lexed token from moo
     * @param {array} value The value
     */
    class VectorValue extends SCADBaseClass {
        constructor(token, value) {
            super();
            this.location = token ? new Location(token) : null;
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
     * @extends {SCADBaseClass}
     * 
     * @param {Token} token The lexed token from moo
     * @param {NumberValue} start Start of the range
     * @param {NumberValue} end End of the range
     * @param {NumberValue} [increment=new NumberValue(1)] Increment step size (default: `0`)
     */
    class RangeValue extends SCADBaseClass {
        constructor(token, start, end, increment = new NumberValue(1)) {
            super();
            this.location = token ? new Location(token) : null;
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
     * @extends {SCADBaseClass}
     * 
     * @param {Token} token The lexed token from moo
     * @param {any} reference The referenced identifier
     * @param {boolean} [negative=false] Negativity flag
     */
    class ReferenceValue extends SCADBaseClass {
        constructor(token, reference, negative = false) {
            super();
            this.location = token ? new Location(token) : null;
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