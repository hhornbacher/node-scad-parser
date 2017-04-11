const _ = require('lodash');

function Values(registerClass) {

    class NumberValue extends ValueNode {
        constructor(value, negative = false) {
            super(value, negative);
        }
    }
    registerClass(NumberValue);

    class BooleanValue extends ValueNode {
        constructor(value) {
            super(value);
        }
    }
    registerClass(BooleanValue);

    class StringValue extends ValueNode {
        constructor(value) {
            super(value);
        }

        toString() {
            return `'${this.value}'`;
        }
    }
    registerClass(StringValue);

    class VectorValue extends ValueNode {
        constructor(values, negative = false) {
            super(null, negative, {}, values);
        }

        valuesToString() {
            return _.map(this.children, child => child.toString()).join(', ');
        }

        toString() {
            return `${this.negative ? '- ' : ''}[${this.valuesToString()}]`;
        }
    }
    registerClass(VectorValue);

    class RangeValue extends VectorValue {
        constructor(start, end, increment = 1) {
            super([start, end, increment]);
        }

        get start() { return this.children[0]; }
        get end() { return this.children[1]; }
        get increment() { return this.children[2]; }
    }
    registerClass(RangeValue);

    class ReferenceValue extends ValueNode {
        constructor(reference, negative = false) {
            super(null, negative, {
                _reference: reference
            });
        }

        toString() {
            return `${this.negative ? '- ' : ''}${this.reference}`;
        }
    }
    registerClass(ReferenceValue);
};

module.exports = Values;