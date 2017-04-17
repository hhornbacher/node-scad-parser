const _ = require('lodash');

function Values(registerClass) {

    class NumberValue extends Number {
        constructor(value) {
            if (_.isString(value))
                value = parseFloat(value);
            super(value);
            _.extend(this, new SCADBaseClass());
        }
    }
    registerClass(NumberValue);

    class BooleanValue extends Boolean {
        constructor(value) {
            super(value);
            _.extend(this, new SCADBaseClass());
        }
    }
    registerClass(BooleanValue);

    class StringValue extends String {
        constructor(value) {
            super(value);
            _.extend(this, new SCADBaseClass());
        }
    }
    registerClass(StringValue);

    class VectorValue extends Array {
        constructor(value) {
            super();
            _.extend(this, new SCADBaseClass());
            if (_.isArray(value))
                _.each(value, v => super.push(v));
            else
                super.push(value);
        }
    }
    registerClass(VectorValue);

    class RangeValue extends SCADBaseClass {
        constructor(start, end, increment = new NumberValue(1)) {
            super();
            this.start = start;
            this.end = end;
            this.increment = increment;
        }

        toString() {
            return `[${this.start.toString()}:${this.increment.toString()}:${this.end.toString()}]`;
        }
    }
    registerClass(RangeValue);

    class ReferenceValue extends SCADBaseClass {
        constructor(reference, negative = false) {
            super();
            this.negative = negative;
            this.reference = reference;
        }

        setNegative(neg) {
            this.negative = neg;
            return this;
        }

        toString() {
            return `${this.negative ? '- ' : ''}${this.reference}`;
        }
    }
    registerClass(ReferenceValue);
};

module.exports = Values;