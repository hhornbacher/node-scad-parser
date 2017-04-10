const _ = require('lodash');

function Entities(registerClass) {

    class Node extends SCADBaseClass {
        constructor(children, privateProps = {}) {
            privateProps = _.merge({
                /*_location: new Location(),*/
                parent: null
            }, privateProps);

            if (_.isArray(children)) {
                privateProps._children = children;
            }

            super(privateProps);

            if (_.isArray(children)) {
                _.each(children, (child) => {
                    child.parent = this;
                });
            }
        }

        get className() {
            return this.constructor.name;
        }

        isType(type = 'Node') {
            if (_.isString(type))
                return (new RegExp(type)).test(this.className);
            if (type.prototype)
                return (new RegExp(type.name)).test(this.className);
            throw Error('Wrong parameter type!');
        }

        getChildrenOfType(type) {
            if (!this.children)
                return null;
            if (!type)
                return this.children;

            return _.find(this.children, (child) => child.isType(type));
        }

        toString(options) {
            options = _.merge({
                indent:0,
                params: {},
                children: []
            }, options);
            const indentString = _.times(options.indent * 2, () => ' ');
            return `${indentString}<${this.className}${_.map(options.params, (val, name) => ' ' + name + '="' + val + '"')}>\n${indentString}${_.map(options.children, child => child.toString({ indent: options.indent + 1 }) + '\n' + indentString)}</${this.className}>`;
        }
    }
    registerClass(Node);

    class BlockNode extends Node {
        constructor(children, privateProps) {
            super(children, privateProps);
        }
    }
    registerClass(BlockNode);

    class RootNode extends BlockNode {
        constructor(children) {
            super(children, {
                _root: true/*,
                _file: file*/
            });
        }

        toString(options) {
            return super.toString({ children: this.children, indent: _.isObject(options) ? options.indent : 0 })
        }
    }
    registerClass(RootNode);

    class CommentNode extends Node {
        constructor(text, multiline = false) {
            super(null, {
                _text: text,
                _multiline: multiline
            });
        }
    }
    registerClass(CommentNode);

    class VariableNode extends Node {
        constructor(name, value) {
            super(null, {
                _name: name,
                _value: value
            });
            value._parent = this;
        }

        toString(options) {
            return super.toString({ params: { 
                name: this.name,
                value: this.value 
            }, indent: _.isObject(options) ? options.indent : 0 })
        }
    }
    registerClass(VariableNode);

    class IncludeNode extends Node {
        constructor(file) {
            super(null, {
                _file: file
            });
        }
    }
    registerClass(IncludeNode);

    class UseNode extends IncludeNode {
    }
    registerClass(UseNode);

    class ModuleNode extends Node {
        constructor(name, params, block) {
            let privateProps = {
                _name: name,
                _block: block,
                _params: params
            };
            super(null, privateProps);
        }
    }
    registerClass(ModuleNode);

    class ForLoopNode extends Node {
        constructor(params, block) {
            let privateProps = {
                _block: block,
                _params: params
            };
            super(null, privateProps);
        }
    }
    registerClass(ForLoopNode);

    class ActionNode extends Node {
        constructor(name, params, modifier, operators, block) {
            let privateProps = {
                _name: name,
                _modifier: modifier,
                _params: params
            };
            if (block) {
                privateProps._block = block;
            }

            if (_.isArray(operators)) {
                operators = operators.trim();
                privateProps._operators = operators;
            }

            super(null, privateProps);

            if (_.isArray(operators)) {
                _.each(operators, (operator) => {
                    operator.parent = this;
                });
            }
        }
    }
    registerClass(ActionNode);

    class ValueNode extends Node {
        constructor(value = null, negative = false, privateProps = {}) {
            super(null, _.merge({
                _value: value,
                _negative: negative
            }, privateProps));
        }

        toString() {
            return `${this.negative?'- ':''}${this.value.toString()}`;
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
            return `'${this.value.toString()}'`;
        }
    }
    registerClass(StringValue);

    class VectorValue extends ValueNode {
        constructor(value, negative = false) {
            super(value, negative);
        }

        toString() {
            return `${this.negative?'- ':''}[${_.map(this.value, val => val.value ? val.value.toString() : val.toString()).join(', ')}]`;
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
            return `${this.negative?'- ':''}${this.reference}`;
        }
    }
    registerClass(ReferenceValue);

    class ExpressionNode extends Node {
        constructor(terms) {
            super(terms);
        }
    }
    registerClass(ExpressionNode);

    class TermNode extends Node {
        constructor(factors) {
            super(factors);
        }
    }
    registerClass(TermNode);

    class FactorNode extends ValueNode {
    }
    registerClass(FactorNode);

    class ParameterListNode extends Node {
        constructor(parameters, standardValuesAllowed = false) {
            super(null, {
                _parameters: parameters,
                _standardValuesAllowed: standardValuesAllowed
            });
        }
    }
    registerClass(ParameterListNode);

    class ForLoopParameterListNode extends Node {
        constructor(parameters) {
            super(null, {
                _parameters: parameters
            });
        }
    }
    registerClass(ForLoopParameterListNode);

    class ParameterNode extends ExpressionNode {
        constructor(value) {
            super([value]);
        }
    }
    registerClass(ParameterNode);
};

module.exports = Entities;