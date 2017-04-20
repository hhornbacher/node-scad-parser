const _ = require('lodash');

function Nodes(registerClass) {

    class Node extends SCADBaseClass {
        constructor(children, privateProps = {}) {
            privateProps = _.merge({
                parent: null
            }, privateProps);

            if (_.isArray(children)) {
                children = _.filter(children, x => !!x);
                privateProps._children = children;
            }
            else
                privateProps._children = [];

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

        setChildren(children) {
            children = _.filter(children, x => !!x);
            if (children.length > 0 && this.__.children.length > 0)
                this.__.children = [];
            _.each(children, child => {
                this.__.children.push(child);
                child.parent = this;
            });
            return this;
        }

        pushChild(child) {
            if (!_.isArray(this.__.children))
                this.__.children = [];

            this.__.children.push(child);
            child.parent = this;

            return this;
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

        childrenToString(options) {
            let { indent: indentCount, children } = options;
            let indent = this.indentToString(indentCount);
            if (_.isString(children)) {
                if (/\n/.test(children))
                    return children.replace('\n', '\n' + indent) + indent;
                else
                    return children.toString();
            }
            else if (_.isArray(children))
                return '\n' + _.map(children, child => {
                    if (child === null)
                        return '(null)\n' + indent;
                    if (_.isNumber(child))
                        return child + '\n' + indent;
                    return child.toString({ indent: indentCount+1 }) + '\n';
                }).join('')  + indent;

            return children.toString();
        }

        paramsToString(params) {
            return _.map(params, (val, name) => ' ' + name + '="' + val + '"').join('');
        }

        toString(options = {
            indent: 0,
            params: {},
            children: []
        }) {
            let indent = this.indentToString(options.indent);
            return `${indent}<${this.className}${this.paramsToString(options.params)}>${this.childrenToString(options)}</${this.className}>`;
        }
    }
    registerClass(Node);

    class RootNode extends Node {
        constructor(children) {
            super(children, {
                _root: true
            });
        }

        toString(options = { indent: 0 }) {
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

        toString(options = { indent: 0 }) {
            const indent = this.indentToString(options.indent);
            return super.toString({
                children: this.text,
                indent: options.indent
            })
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

        toString(options = { indent: 0 }) {
            return super.toString({
                children: this.value,
                params: {
                    name: this.name,
                    type: this.value.constructor.name
                },
                indent: options.indent
            });
        }
    }
    registerClass(VariableNode);

    class IncludeNode extends Node {
        constructor(file) {
            super(null, {
                _file: file
            });
        }

        toString(options = { indent: 0 }) {
            return super.toString({
                children: this.file,
                indent: options.indent
            })
        }
    }
    registerClass(IncludeNode);

    class UseNode extends IncludeNode {
    }
    registerClass(UseNode);

    class ModuleNode extends Node {
        constructor(name, params, block) {
            super(block, {
                _name: name,
                _params: params
            });
        }

        toString(options = { indent: 0 }) {
            let params = {
                name: this.name
            };
            if (this.params !== null && this.params.length > 0)
                params.params = this.params;

            return super.toString({
                children: this.children,
                indent: options.indent,
                params
            });
        }
    }
    registerClass(ModuleNode);

    class ForLoopNode extends Node {
        constructor(params, block) {
            super(block, {
                _params: params
            });
        }
    }
    registerClass(ForLoopNode);

    class ActionNode extends Node {
        constructor(name, params=[]) {
            let privateProps = {
                _name: name,
                _modifier: null,
                _params: params,
                _label: null
            };

            super([], privateProps);
        }

        setModifier(modifier) {
            this.__.modifier = modifier;
            return this;
        }

        setLabel(label) {
            this.__.label = label;
            return this;
        }

        setBlock(block) {
            this.children = block.children;
            return this;
        }

/*        setParams(params) {
            params = _.filter(params, x => !!x);
            if (params.length > 0 && this.__.params.length > 0)
                this.__.params = [];
            _.each(params, param => {
                this.__.params.push(param);
                param.parent = this;
            });
            return this;
        }*/

        pushParam(param) {
            this.__.params.push(param);
            param.parent = this;
            return this;
        }

        toString(options = { indent: 0 }) {
            let params = {
                name: this.name,
            };
            if (this.label !== null)
                params.label = this.label;
            if (this.modifier !== null)
                params.modifier = this.modifier;
            if (this.params !== null && this.params.length > 0)
                params.params = this.params;
            return super.toString({
                indent: options.indent,
                children: this.children,
                params
            });
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

        toString(options = { indent: 0 }) {
            let params = {
                name: this.name
            };
            if (this.params !== null && this.params.length > 0)
                params.params = this.params;
            return super.toString({
                children: this.expression,
                indent: options.indent,
                params
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
                return `${this.negative ? '- ' : ''}(${this.leftExpression}${this.operator}${this.rightExpression})`;
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