const _ = require('lodash');

function Nodes(registerClass) {

    class Node extends SCADBaseClass {
        constructor(children, privateProps = {}) {
            privateProps = _.merge({
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

        indentToString(count) {
            return _.times(count * 2, () => ' ').join('');
        }

        childrenToString(children, indentCount = 0) {
            let indent = this.indentToString(indentCount)
            if (_.isString(children)) {
                if (/\n/.test(children))
                    return children.replace('\n', '\n' + indent) + indent;
                else
                    return children.toString();
            }
            else if (_.isArray(children))
                return '\n' + indent + _.map(children, child => {
                    if (child === null)
                        return '(null)\n' + indent;
                    if (_.isNumber(child))
                        return child + '\n' + indent;
                    return child.toString({ indent: indentCount + 1 }) + '\n' + indent;
                }).join('');

            return children.toString();
        }

        paramsToString(params) {
            return _.map(params, (val, name) => ' ' + name + '="' + val + '"').join('');
        }

        toString(options) {
            options = _.merge({
                indent: 0,
                params: {},
                children: []
            }, options);
            let indent = this.indentToString(options.indent);
            return `${indent}<${this.className}${this.paramsToString(options.params)}>${this.childrenToString(options.children, options.indent)}</${this.className}>`;
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
                _text: multiline ? text : text.trim(),
                _multiline: multiline
            });
        }

        toString(options) {
            const indent = this.indentToString(options.indent);
            return super.toString({ children: this.text, indent: _.isObject(options) && options.indent ? options.indent : 0 })
        }
    }
    registerClass(CommentNode);

    class VariableNode extends Node {
        constructor(name, value) {
            super(null, {
                _name: name,
                _value: value
            });
        }

        toString(options) {
            return super.toString({
                children: this.value,
                params: {
                    name: this.name,
                    type: this.value.constructor.name
                },
                indent: _.isObject(options) && options.indent ? options.indent : 0
            })
        }
    }
    registerClass(VariableNode);

    class IncludeNode extends Node {
        constructor(file) {
            super(null, {
                _file: file
            });
        }

        toString(options) {
            return super.toString({
                params: {
                    file: this.file
                },
                indent: _.isObject(options) && options.indent ? options.indent : 0
            })
        }
    }
    registerClass(IncludeNode);

    class UseNode extends IncludeNode {
    }
    registerClass(UseNode);

    class ModuleNode extends Node {
        constructor(name, params, block) {
            super(null, {
                _name: name,
                _block: block,
                _params: params
            });
        }
    }
    registerClass(ModuleNode);

    class ForLoopNode extends Node {
        constructor(params, block) {
            super(null, {
                _block: block,
                _params: params
            });
        }
    }
    registerClass(ForLoopNode);

    class ActionNode extends Node {
        constructor(name, params, block) {
            let privateProps = {
                _name: name,
                _modifier: null,
                _params: params,
                _label: null
            };
            if (block) {
                privateProps._block = block;
            }

            /*            if (_.isArray(operators)) {
                            operators = operators.trim();
                            privateProps._operators = operators;
                        }*/

            super(null, privateProps);

            /*            if (_.isArray(operators)) {
                            _.each(operators, (operator) => {
                                operator.parent = this;
                            });
                        }*/
        }

        setModifier(modifier) {
            this.__.modifier = modifier;
            return this;
        }

        setLabel(label) {
            this.__.label = label;
            return this;
        }
    }
    registerClass(ActionNode);

    class FunctionNode extends Node {
        constructor(name, params, expression) {
            super(null, {
                _name: name,
                _params: params,
                _expression: expression
            });
        }
    }
    registerClass(FunctionNode);

    require('./values')(registerClass);

    class ExpressionNode extends Node {
        constructor(leftExpression, rightExpression = null, operator = null, negative = false) {
            super(null, {
                _leftExpression: leftExpression,
                _rightExpression: rightExpression,
                _operator: operator,
                _negative: negative
            });

            if (leftExpression.constructor.name === 'ExpressionNode') {
                leftExpression.parent = this;
            }
            if (rightExpression !== null && rightExpression.constructor.name === 'ExpressionNode') {
                rightExpression.parent = this;
            }
        }

        setNegative(neg) {
            this.__.negative = neg;
            return this;
        }

        toString() {
            if (this.rightExpression === null)
                return `${this.negative ? '- ' : ''}${this.leftExpression}`;
            if (this.rightExpression !== null && this.operator !== null)
                return `${this.negative ? '- ' : ''}${this.leftExpression}${this.operator}${this.rightExpression}`;
        }
    }
    registerClass(ExpressionNode);

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
};

module.exports = Nodes;