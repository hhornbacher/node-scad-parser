const _ = require('lodash');

function Values(registerClass) {

    class ValueNode extends Node {
        constructor(value = null, negative = false, privateProps = {}, children = null) {
            super(children, _.merge({
                _value: value,
                _negative: negative
            }, privateProps));
        }

        toString() {
            return `${this.negative ? '- ' : ''}${this.value.toString()}`;
        }
    }
    registerClass(ValueNode);

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

    class RangeValue extends ValueNode {
        constructor(start, end, increment = new NumberValue(1)) {
            super(null, false,{
                _start: start,
                _end: end,
                _increment: increment
            });
        }

        toString() {
            return `[${this.start.toString()}:${this.increment.toString()}:${this.end.toString()}]`;
        }
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