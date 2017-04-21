const _ = require('lodash');

function Values(registerClass) {

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

    class BooleanValue extends Boolean {
        constructor(token, value) {
            super(value);
            _.extend(this, new SCADBaseClass());
            this.location = token ? new Location(token) : null;
        }
    }
    registerClass(BooleanValue);

    class StringValue extends String {
        constructor(token, value) {
            super(value);
            _.extend(this, new SCADBaseClass());
            this.location = token ? new Location(token) : null;
        }
    }
    registerClass(StringValue);

    class VectorValue extends SCADBaseClass {
        constructor(token, value) {
            super();
            this.location = token ? new Location(token) : null;
            this.value = value;
        }

        toString() {
            return this.value.toString();
        }
    }
    registerClass(VectorValue);

    class RangeValue extends SCADBaseClass {
        constructor(token, start, end, increment = new NumberValue(1)) {
            super();
            this.location = token ? new Location(token) : null;
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
        constructor(token, reference, negative = false) {
            super();
            this.location = token ? new Location(token) : null;
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