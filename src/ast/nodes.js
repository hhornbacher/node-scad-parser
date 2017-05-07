/**
 * Abstract nodes of the scad language
 * @module ast/nodes
 */
const _ = require('lodash');

function Nodes(registerClass) {

    /**
     * Node base class
     * 
     * @class Node
     * 
     * @param {Array.Node} children Children of this node
     * @param {any} [privateProps={}] Private properties of this node
     * @param {Array.Token} tokens The tokens of this node
     */
    class Node {
        constructor(children, tokens) {
            if (_.isArray(children)) {
                children = _.filter(children, x => !!x);
                _.each(children, (child) => {
                    child.parent = this;
                });
                this.children = children;
            }
            else
                this.children = [];

            this.tokens = tokens;
        }

        /**
         * Get the name of this class
         * 
         * @readonly
         * @returns [String} Name of the constructor
         */
        get className() {
            return this.constructor.name;
        }

        /**
         * Find a node by it's token
         * 
         * @param {Token} token Lexed token within a code file
         * @returns [Node} If found, else `null`
         */
        findByToken(token) {
            let node = null;
            _.each(this.children, child => {
                if (_.find(child.tokens, token)) {
                    node = child;
                    return false;
                }
                node = child.findByToken(token);
                if (node)
                    return false;
            });
            return node;
        }

        /**
         * Find a node by it's type (class name without 'Node')
         * 
         * @param {string} [type='Root'] 
         * @returns {Node}
         */
        findByType(type = 'Root') {
            let nodes = _.find(this.children, child => child.className === type + 'Node') || [];
            _.each(this.children, child => {
                nodes = _.concat(nodes, child.findByType(type));
            });
            return nodes;
        }

        /**
         * Find a node by it's name (variables,modules,functions,actions)
         * 
         * @param {any} name 
         * @returns {Node}
         */
        findByName(name) {
            let nodes = [];
            _.each(this.children, child => {
                if (child.name === name)
                    nodes.push(child);
                nodes = _.concat(nodes, child.findByName(name));
            });
            return nodes;
        }

        /**
         * Find a node by it's value (looks in values)
         * @todo Look also deep in expressions!
         * 
         * @param {any} value 
         * @returns {Node}
         * 
         * @memberOf Node
         */
        findByValue(value) {
            let nodes = [];
            _.each(this.children, child => {
                if (child.value) {
                    if (child.value.isEqual && child.value.isEqual(value)) {
                        nodes.push(child);
                    }
                }
                nodes = _.concat(nodes, child.findByValue(value));
            });
            return nodes;
        }

        /**
         * Set the children of this node
         * 
         * @param {Array.Node} children Children of this node
         * @returns {Node} this
         */
        setChildren(children) {
            children = _.filter(children, x => !!x);
            this.children = [];
            _.each(children, child => {
                this.children.push(child);
                child.parent = this;
            });
            return this;
        }

        /**
         * Create a string with count whitespaces
         * 
         * @param {number} count Count of whitespaces
         * @returns [String}
         */
        indentToString(count) {
            return _.times(count * 2, () => ' ').join('');
        }

        /**
         * Get string representation of children
         * 
         * @param {Object} options Options for outputting the children
         * @returns [String}
         */
        childrenToString(options) {
            let { indent: indentCount, children } = options;
            let indent = this.indentToString(indentCount);
            if (_.isString(children)) {
                if (/\n/.test(children))
                    return children.replace('\n', '\n' + indent) + indent;
                else
                    return children.toString();
            }
            else if (_.isArray(children)) {
                if (children.length > 0)
                    return '\n'
                        + _.map(children, child => child.toString({ indent: indentCount + 1 }) + '\n').join('')
                        + indent;
                return '';
            }

            if (children && _.isFunction(children.toString))
                return children.toString();
            return null;
        }

        /**
         * Get string representation of params
         * 
         * @param {array} params Params to convert
         * @returns [String}
         */
        paramsToString(params) {
            return _.map(params, (val, name) => ' ' + name + '="' + val + '"').join('');
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0, params: {}, children: []}] 
         * @returns [String}
         */
        toString(options = {
            indent: 0,
            params: {},
            children: []
        }) {
            let indent = this.indentToString(options.indent);
            let children = this.childrenToString(options);
            let params = this.paramsToString(options.params);
            if (children)
                return `${indent}<${this.className.replace('Node', '')}${params}>${children}</${this.className.replace('Node', '')}>`;
            return `${indent}<${this.className.replace('Node', '')}${params} />`;
        }

        childrenToCode(options) {
            let { indent: indentCount, children } = options;
            let indent = this.indentToString(indentCount);

            if (children.length > 0)
                return '\n'
                    + _.map(children, child => child.toCode({ indent: indentCount + 1 }) + '\n').join('')
                    + indent;
        }

        toCode(options = {
            indent: 0,
            params: {},
            children: []
        }) {
            let indent = this.indentToString(options.indent);
            return `${indent}${this.childrenToCode(options)}`;
        }
    }
    registerClass(Node);

    /**
     * Root node of an AST
     * 
     * @class RootNode
     * @extends {Node}
     * 
     * @param {Array.Node} children Children of this node
     */
    class RootNode extends Node {
        constructor(children) {
            super(children, null);
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString(options = { indent: 0 }) {
            return super.toString({ children: this.children, indent: options.indent })
        }

        toCode(options = { indent: -1 }) {
            return super.toCode({ children: this.children, indent: options.indent })
        }
    }
    registerClass(RootNode);

    /**
     * Code comment
     * 
     * @class CommentNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} text 
     * @param {boolean} [multiline=false] 
     */
    class CommentNode extends Node {
        constructor(tokens, text, multiline = false) {
            super(null, tokens);
            this.text = multiline ? text : text.trim();
            this.multiline = multiline;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString(options = { indent: 0 }) {
            const indent = this.indentToString(options.indent);
            return super.toString({
                params: {
                    multiline: this.multiline ? 'true' : 'false',
                    text: JSON.stringify(this.text).replace(/"(.*)"/, '$1')
                },
                indent: options.indent
            })
        }

        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            if (this.multiline)
                return `${indent}/* ${_.map(this.text.split('\n'), line => line.trim()).join(`\n${indent}`)} */`;
            return `${indent}// ${this.text}`;
        }
    }
    registerClass(CommentNode);

    /**
     * Variable definition
     * 
     * @class VariableNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} name 
     * @param {any} value 
     */
    class VariableNode extends Node {
        constructor(tokens, name, value) {
            super(null, tokens);
            this.name = name;
            this.value = value;
        }

        /**
         * Find a node by it's token
         * 
         * @param {Token} token Lexed token within a code file
         * @returns [Node} If found, else `null`
         */
        findByToken(token) {
            let node = null;
            if (_.isMatch(this.value.token, token) && this.value.className !== 'ExpressionNode')
                node = this.value;
            else if (this.value.className === 'ExpressionNode')
                node = this.value.findByToken(token);
            return node;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString(options = { indent: 0 }) {
            return super.toString({
                params: {
                    name: this.name,
                    type: this.value.constructor.name,
                    value: this.value
                },
                indent: options.indent
            });
        }

        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            return `${indent}${this.name} = ${this.value.toCode()};`;
        }
    }
    registerClass(VariableNode);

    /**
     * Parameter definition
     * 
     * @class ParameterNode
     * @extends {VariableNode}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {string} name 
     * @param {any} value 
     */
    class ParameterNode extends VariableNode {
        constructor(tokens, name, value = null) {
            super(tokens, name, value);
        }

        toString(options = { indent: 0 }) {
            if (this.value)
                return `${this.name} = ${this.value.toString()}`;
            return `${this.name}`;
        }

        toCode(options = { indent: 0 }) {
            if (this.name)
                return `${this.name} = ${this.value.toCode()}`;
            return `${this.name}`;
        }
    }
    registerClass(ParameterNode);

    /**
     * Argument definition
     * 
     * @class ArgumentNode
     * @extends {VariableNode}
     * @param {any} value 
     * @param {string} name 
     */
    class ArgumentNode extends VariableNode {
        constructor(tokens, value, name = null) {
            super(tokens, name, value);
        }

        toString(options = { indent: 0 }) {
            if (this.name)
                return `${this.name} = ${this.value.toString()}`;
            return `${this.value.toString()}`;
        }

        toCode(options = { indent: 0 }) {
            if (this.name)
                return `${this.name} = ${this.value.toCode()}`;
            return `${this.value.toCode()}`;
        }
    }
    registerClass(ArgumentNode);

    /**
     * Include statement
     * 
     * @class IncludeNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} file 
     */
    class IncludeNode extends Node {
        constructor(tokens, file) {
            super(null, tokens);
            this.file = file;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString(options = { indent: 0 }) {
            return super.toString({
                params: {
                    file: this.file
                },
                indent: options.indent
            })
        }

        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            return `${indent}include <${this.file}>;`;
        }
    }
    registerClass(IncludeNode);

    /**
     * Use statement
     * 
     * @class UseNode
     * @extends {IncludeNode}
     */
    class UseNode extends IncludeNode {
        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            return `${indent}use <${this.file}>;`;
        }
    }
    registerClass(UseNode);

    /**
     * Module definition
     * 
     * @class ModuleNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} name 
     * @param {any} params 
     * @param {any} block 
     */
    class ModuleNode extends Node {
        constructor(tokens, name, params = null, block = []) {
            super(block, tokens);
            this.name = name;
            this.params = params;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
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

        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            return `${indent}module ${this.name}() {${super.toCode({ children: this.children, indent: options.indent })}${indent}}`;
        }
    }
    registerClass(ModuleNode);

    /**
     * For loop statement
     * 
     * @class ForLoopNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} params 
     * @param {any} block 
     */
    class ForLoopNode extends Node {
        constructor(tokens, params, block) {
            super(block, tokens);
            this.params = params;
        }
    }
    registerClass(ForLoopNode);

    /**
     * Action call statement
     * 
     * @class ActionNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} name 
     * @param {any} [params=[]] 
     */
    class ActionNode extends Node {
        constructor(tokens, name, params = []) {
            super(null, tokens);
            this.name = name.replace(/([!#\*\%]?)(.*)/, '$2');
            this.modifier = name.replace(/([!#\*\%]?)(.*)/, '$1') || null;
            this.params = params;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString(options = { indent: 0 }) {
            let params = {
                name: this.name,
            };
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

        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            if (this.children > 0)
                return
            return `${indent}${this.modifier || ''}${this.name}();`;
        }
    }
    registerClass(ActionNode);

    /**
     * Function definition
     * 
     * @class FunctionNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} name 
     * @param {any} params 
     * @param {any} expression 
     */
    class FunctionNode extends Node {
        constructor(tokens, name, params, expression) {
            super(null, tokens);
            this.name = name;
            this.params = params;
            this.expression = expression;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString(options = { indent: 0 }) {
            let params = {
                name: this.name
            };
            if (this.params && this.params.length > 0)
                params.params = this.params;
            return super.toString({
                children: this.expression,
                indent: options.indent,
                params
            });
        }

        toCode(options = { indent: 0 }) {
            let indent = this.indentToString(options.indent);
            return `${indent}function ${this.name}() = ${this.expression.toCode()};`;
        }
    }
    registerClass(FunctionNode);

    /**
     * Expression
     * 
     * @class ExpressionNode
     * @extends {Node}
     * 
     * @param {Array.Token} tokens The tokens of this node
     * @param {any} leftExpression 
     * @param {any} [rightExpression=null] 
     * @param {any} [operator=null] 
     * @param {boolean} [negative=false] 
     */
    class ExpressionNode extends Node {
        constructor(tokens, leftExpression, rightExpression = null, operator = null) {
            super(null, tokens);

            this.leftExpression = leftExpression;
            this.rightExpression = rightExpression;
            this.operator = operator;
            this.negative = false;

            if (leftExpression.constructor.name === 'ExpressionNode') {
                leftExpression.parent = this;
            }
            if (rightExpression !== null && rightExpression.constructor.name === 'ExpressionNode') {
                rightExpression.parent = this;
            }
        }

        /**
         * Find a node by it's token
         * 
         * @param {Token} token Lexed token within a code file
         * @returns [Node} If found, else `null`
         */
        findByToken(token) {
            let node = null;
            /*            console.log(this.toString());
                        console.log(this.leftExpression.tokens[0], this.rightExpression ? this.rightExpression.tokens[0] : null);
                        console.log(this.leftExpression.tokens[0], token);
                        console.log(_.isMatch(this.leftExpression.tokens[0], token));*/
            if (this.rightExpression) {
                console.log(this.rightExpression.tokens[0], token);
                console.log(_.isMatch(this.rightExpression.tokens[0], token));
            }
            if (_.isMatch(this.leftExpression.tokens[0], token) && this.leftExpression.className !== 'ExpressionNode')
                node = this.leftExpression;
            else if (this.leftExpression.className === 'ExpressionNode')
                node = this.leftExpression.findByToken(token);
            else if (this.rightExpression && _.isMatch(this.rightExpression.tokens[0], token) && this.rightExpression.className !== 'ExpressionNode')
                node = this.rightExpression;
            else if (this.rightExpression && this.rightExpression.className === 'ExpressionNode')
                node = this.rightExpression.findByToken(token);
            return node;
        }

        /**
         * Turn this expression negative
         * 
         * @param {Boolean} neg 
         * @returns {ReferenceValue} this
         */
        setNegative(neg) {
            this.negative = neg;
            return this;
        }

        /**
         * Get string representation of this node
         * 
         * @param {Object} [options={ indent: 0 }] 
         * @returns [String}
         */
        toString() {
            if (this.rightExpression === null)
                return `${this.negative ? '-' : ''}${this.leftExpression.toString()}`;
            if (this.rightExpression !== null && this.operator !== null)
                return `${this.negative ? '-' : ''}(${this.leftExpression.toString()}${this.operator}${this.rightExpression.toString()})`;
        }

        toCode(options = { indent: 0 }) {
            if (this.rightExpression === null)
                return `${this.negative ? '-' : ''}${this.leftExpression.toCode()}`;
            if (this.rightExpression !== null && this.operator !== null)
                return `${this.negative ? '-' : ''}(${this.leftExpression.toCode()}${this.operator}${this.rightExpression.toCode()})`;
        }
    }
    registerClass(ExpressionNode);
};

module.exports = Nodes;