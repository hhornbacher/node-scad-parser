"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract nodes of the scad language
 */
const _ = require("lodash");
const morph = require("tree-morph");
/**
 * Node base class
 *
 */
class Node {
    constructor(tokens = [], name) {
        this.tokens = tokens;
        this.name = name || null;
    }
    get className() {
        let instance = this.constructor;
        return instance.name;
    }
    getChildren() {
        return [];
    }
    morph(dataMutator, layoutMutator = () => { }) {
        return morph(this, dataMutator, layoutMutator);
    }
    /**
     * Find a node by it's token
     */
    findByToken(token) {
        return this.morph((node) => {
            if (_.find(node.tokens, token))
                return node;
        })[0] || null;
        /*
        let node = null;
        _.each(this.children, (child: Node) => {
            if (_.find(child.tokens, token)) {
                node = child;
                return false;
            }
            node = child.findByToken(token);
            if (node)
                return false;
        });
        return node;*/
    }
    /**
     * Find a node by it's type (export class name without 'Node')
     */
    findByType(type) {
        return this.morph((node) => {
            if (node instanceof type)
                return node;
        })[0] || null;
        /*        let nodes = _.filter(this.children, child => child instanceof type);
                _.each(this.children, child => {
                    nodes = _.concat(nodes, child.findByType(type));
                });
                return nodes;*/
    }
    /**
     * Find a node by it's name (variables,modules,functions,actions)
     */
    findByName(name) {
        return this.morph((node) => {
            if (node.name === name)
                return node;
        })[0] || null;
        /*let nodes: Array<Node> = [];
        _.each(this.children, (child: Node) => {
            if (child.name === name)
                nodes.push(child);
            nodes = _.concat(nodes, child.findByName(name));
        });
        return nodes;*/
    }
    /**
     * Find a node by it's value (looks in values)
     *
     */
    findByValue(value) {
        return this.morph((node) => {
            if (node instanceof VariableNode && node.value !== null && node.value.isEqual(value))
                return node;
        })[0] || null;
        /*        let nodes: Array<Node> = [];
                _.each(this.children, (child: any) => {
                    if (child.value) {
                        if (child.value.isEqual && child.value.isEqual(value)) {
                            nodes.push(child);
                        }
                    }
                    nodes = _.concat(nodes, child.findByValue(value));
                });
                return nodes;*/
    }
    /**
     * Create a string with count whitespaces
     */
    indentToString(count) {
        return _.join(_.times(count * 2, () => ' '), '');
    }
    /**
     * Get string representation of children
     */
    childrenToString(indent, children) {
        if (children.length > 0)
            return '\n'
                + _.join(_.map(children, child => child.toString(indent + 1) + '\n'), '')
                + this.indentToString(indent);
        return null;
    }
    /**
     * Get string representation of params
     */
    paramsToString(params) {
        return _.join(_.map(params, (val, name) => val !== null ? ' ' + name + '="' + val.toString() + '"' : ''), '');
    }
    /**
     * Get string representation of this node
     */
    toString(indent = 0, params = {}, children = []) {
        let childrenString = this.childrenToString(indent, children);
        if (childrenString)
            return `${this.indentToString(indent)}<${this.className.replace('Node', '')}${this.paramsToString(params)}>${childrenString}</${this.className.replace('Node', '')}>`;
        return `${this.indentToString(indent)}<${this.className.replace('Node', '')}${this.paramsToString(params)} />`;
    }
    childrenToCode(indent, children) {
        if (children.length > 0)
            return '\n'
                + _.join(_.map(children, child => child.toCode(indent + 1) + '\n'), '')
                + this.indentToString(indent);
        return '';
    }
    toCode(indent, /*params?: {},*/ children = []) {
        return `${this.indentToString(indent)}${this.childrenToCode(indent, children)}`;
    }
}
exports.Node = Node;
class ParentNode extends Node {
    constructor(children = [], tokens = [], name) {
        super(tokens, name);
        this.children = children;
    }
    getChildren() {
        return this.children;
    }
    /**
     * Set the children of this node
     */
    setChildren(children) {
        children = _.filter(children, x => !!x);
        this.children = [];
        _.each(children, (child) => {
            this.children.push(child);
            //child.parent = this;
        });
        return this;
    }
    /**
     * Get string representation of this node
     */
    toString(indent, params) {
        return super.toString(indent, params, this.children);
    }
    toCode(indent = -1 /*, params?: {}*/) {
        return super.toCode(indent, /*params,*/ this.children);
    }
}
exports.ParentNode = ParentNode;
/**
 * Root node of an AST
 *
 *
 */
class RootNode extends ParentNode {
    constructor(children) {
        super(children);
    }
}
exports.RootNode = RootNode;
/**
 * Code comment
 *
 *
 */
class CommentNode extends Node {
    constructor(tokens, text, multiline = false) {
        super(tokens);
        this.text = multiline ? text : text.trim();
        this.multiline = multiline;
    }
    /**
     * Get string representation of this node
     */
    toString(indent = 0) {
        return super.toString(indent, {
            multiline: this.multiline ? 'true' : 'false',
            text: JSON.stringify(this.text).replace(/"(.*)"/, '$1')
        });
    }
    toCode(indent = 0) {
        if (this.multiline)
            return `${this.indentToString(indent)}/* ${_.join(_.map(this.text.split('\n'), line => line.trim()), `\n${this.indentToString(indent)}`)} */`;
        return `${this.indentToString(indent)}// ${this.text}`;
    }
}
exports.CommentNode = CommentNode;
/**
 * Variable definition
 *
 */
class VariableNode extends Node {
    constructor(tokens, name, value) {
        super(tokens);
        this.name = name;
        this.value = value;
    }
    /**
     * Find a node by it's token
     */
    /*  findByToken(token: Token) {
          if (this.value !== null && _.isMatch(this.value.tokens, (t: Token) => token.toString() === t.toString()) && !(this.value instanceof ExpressionNode))
              return this.value;
          else if (this.value instanceof ExpressionNode)
              return this.value.findByToken(token);
          return null;
      }*/
    /**
     * Get string representation of this node
     */
    toString(indent = 0) {
        return super.toString(indent, {
            name: this.name,
            type: this.value !== null ? this.value.className : 'null',
            value: this.value
        });
    }
    toCode(indent = 0) {
        return `${this.indentToString(indent)}${this.name} = ${this.value.toCode()};`;
    }
}
exports.VariableNode = VariableNode;
/**
 * Parameter definition
 *
 */
class ParameterNode extends Node {
    constructor(tokens, name, value = null) {
        super(tokens);
        this.name = name;
        this.value = value;
    }
    toString() {
        if (this.value)
            return `${this.name} = ${this.value.toString()}`;
        return `${this.name}`;
    }
    toCode() {
        if (this.name)
            return `${this.name} = ${this.value !== null ? this.value.toCode() : 'null'}`;
        return `${this.name}`;
    }
}
exports.ParameterNode = ParameterNode;
/**
 * Argument definition
 *
 */
class ArgumentNode extends VariableNode {
    constructor(tokens, value, name = null) {
        super(tokens, name || '', value);
    }
    toString() {
        if (this.name)
            return `${this.name} = ${this.value !== null ? this.value.toString() : ''}`;
        return `${this.value !== null ? this.value.toString() : ''}`;
    }
    toCode() {
        if (this.name)
            return `${this.name} = ${this.value !== null ? this.value.toString() : ''}`;
        return `${this.value !== null ? this.value.toString() : ''}`;
    }
}
exports.ArgumentNode = ArgumentNode;
/**
 * Include statement
 *
 */
class IncludeNode extends Node {
    constructor(tokens, file) {
        super(tokens);
        this.file = file;
    }
    /**
     * Get string representation of this node
     */
    toString(indent = 0) {
        return super.toString(indent, {
            file: this.file
        });
    }
    toCode(indent = 0) {
        return `${this.indentToString(indent)}include <${this.file}>;`;
    }
}
exports.IncludeNode = IncludeNode;
/**
 * Use statement
 *
 */
class UseNode extends IncludeNode {
    toCode(indent = 0) {
        return `${this.indentToString(indent)}use <${this.file}>;`;
    }
}
exports.UseNode = UseNode;
/**
 * Module definition
 *
 */
class ModuleNode extends ParentNode {
    constructor(tokens, name, params = [], block) {
        super(block, tokens, name);
        this.params = params;
    }
    /**
     * Get string representation of this node
     */
    toString(indent = 0) {
        return super.toString(indent, {
            name: this.name,
            params: this.params
        });
    }
    toCode(indent = 0) {
        return `${this.indentToString(indent)}module ${this.name}() {${super.toCode(indent)}${this.indentToString(indent)}}`;
    }
}
exports.ModuleNode = ModuleNode;
/**
 * For loop statement
 *
 */
class ForLoopNode extends ParentNode {
    constructor(tokens, params, block) {
        super(block, tokens);
        this.params = params;
    }
}
exports.ForLoopNode = ForLoopNode;
/**
 * Action call statement
 *
 */
class ActionNode extends ParentNode {
    constructor(tokens, name, args = []) {
        super([], tokens, name.replace(/([!#\*\%]?)(.*)/, '$2'));
        this.modifier = name.replace(/([!#\*\%]?)(.*)/, '$1') || '';
        this.args = args;
    }
    /**
     * Get string representation of this node
     */
    toString(indent = 0) {
        return super.toString(indent, {
            name: this.name,
            modifier: this.modifier,
            args: _.join(this.args, ', ')
        });
    }
    toCode(indent = 0) {
        return `${this.indentToString(indent)}${this.modifier || ''}${this.name}();`;
    }
}
exports.ActionNode = ActionNode;
/**
 * Function definition
 *
 */
class FunctionNode extends Node {
    constructor(tokens, name, params, expression) {
        super(tokens, name);
        this.params = params;
        this.expression = expression;
    }
    toString(indent = 0) {
        let params = {
            name: this.name,
            params: this.params
        };
        if (this.params && this.params.length > 0)
            params.params = this.params;
        return super.toString(indent, {
            name: this.name,
            params: this.params
        });
    }
    toCode(indent = 0) {
        return `${this.indentToString(indent)}function ${this.name}() = ${this.expression.toCode()};`;
    }
}
exports.FunctionNode = FunctionNode;
/**
 * Expression
 *
 */
class ExpressionNode extends Node {
    constructor(tokens, leftExpression, rightExpression = null, operator = null) {
        super(tokens);
        this.leftExpression = leftExpression;
        this.rightExpression = rightExpression;
        this.operator = operator;
        this.negative = false;
        /*        if (leftExpression.constructor.name === 'ExpressionNode') {
                    leftExpression.parent = this;
                }
                if (rightExpression !== null && rightExpression.constructor.name === 'ExpressionNode') {
                    rightExpression.parent = this;
                }*/
    }
    /**
     * Turn this expression negative
     */
    setNegative(neg) {
        this.negative = neg;
        return this;
    }
    toString() {
        if (this.rightExpression === null)
            return `${this.negative ? '-' : ''}${this.leftExpression.toString()}`;
        if (this.rightExpression !== null && this.operator !== null)
            return `${this.negative ? '-' : ''}(${this.leftExpression.toString()}${this.operator}${this.rightExpression.toString()})`;
    }
    toCode() {
        if (this.rightExpression === null)
            return `${this.negative ? '-' : ''}${this.leftExpression.toCode()}`;
        if (this.rightExpression !== null && this.operator !== null)
            return `${this.negative ? '-' : ''}(${this.leftExpression.toCode()}${this.operator}${this.rightExpression.toCode()})`;
    }
}
exports.ExpressionNode = ExpressionNode;
//# sourceMappingURL=nodes.js.map