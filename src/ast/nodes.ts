/**
 * Abstract nodes of the scad language
 */
import * as _ from 'lodash';
import morph from 'tree-morph';
import { Token } from '../nearley/tokens';
import { Value } from './values';

export interface Context {
    skip(): void;

    break(): void;
    remove(): void;
    replace(node): void;
    parent: Node;
    depth: number;
    level: number;
    index: number;
}
export type DataMutator = (node: Node, context: Context) => TreeNode | undefined | null;
export type LayoutMutator = (node: Node | null, parent: Node) => void;
type TreeMorph = (root: TreeNode, dataMutator: DataMutator, layoutMutator: LayoutMutator) => Array<Node>;
declare var morph: TreeMorph;

export interface TreeNode {
    getChildren(): Array<TreeNode>;
}

/**
 * Node base class
 * 
 */
export class Node implements TreeNode {
    tokens: Array<Token>;
    name: string | null;

    constructor(tokens: Array<Token> = [], name?: string) {
        this.tokens = tokens;
        this.name = name || null;
    }

    get className() {
        let instance: any = this.constructor;
        return instance.name;
    }

    getChildren(): Array<Node> {
        return [];
    }

    protected morph(dataMutator: DataMutator, layoutMutator: LayoutMutator = () => { }) {
        return morph(this, dataMutator, layoutMutator);
    }

    /**
     * Find a node by it's token
     * 
     */
    findByToken(token: Token): Node | null {
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
     * 
     */
    findByType<T>(type: { new (): T }) {
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
     * 
     */
    findByName(name: string) {
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
     * 
     */
    findByValue(value: Value) {
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
     * 
     */
    indentToString(count: number) {
        return _.times(count * 2, () => ' ').join('');
    }

    /**
     * Get string representation of children
     * 
     */
    childrenToString(indent: number, children: Array<Node>) {
        if (children.length > 0)
            return '\n'
                + _.map(children, child => child.toString(indent + 1) + '\n').join('')
                + this.indentToString(indent);
        return null;
    }

    /**
     * Get string representation of params
     * 
     */
    paramsToString(params: {}) {
        return _.map(params, (val, name) => val !== null ? ' ' + name + '="' + val + '"' : '').join('');
    }

    /**
     * Get string representation of this node
     * 
     */
    toString(indent: number = 0, params: {} = {}, children: Array<Node> = []) {
        let childrenString = this.childrenToString(indent, children);
        if (childrenString)
            return `${this.indentToString(indent)}<${this.className.replace('Node', '')}${this.paramsToString(params)}>${childrenString}</${this.className.replace('Node', '')}>`;
        return `${this.indentToString(indent)}<${this.className.replace('Node', '')}${this.paramsToString(params)} />`;
    }

    childrenToCode(indent: number, children: Array<Node>) {
        if (children.length > 0)
            return '\n'
                + _.map(children, child => child.toCode(indent + 1) + '\n').join('')
                + this.indentToString(indent);
        return '';
    }

    toCode(indent: number, params?: {}, children: Array<Node> = []) {
        console.log(params);
        return `${this.indentToString(indent)}${this.childrenToCode(indent, children)}`;
    }
}


export class ParentNode extends Node {
    children: Array<Node>;

    constructor(children: Array<Node> = [], tokens: Array<Token> = [], name?: string) {
        super(tokens, name);
        this.children = children;
    }

    getChildren() {
        return this.children;
    }

    /**
     * Set the children of this node
     * 
     */
    setChildren(children: Array<Node>) {
        children = _.filter(children, x => !!x);
        this.children = [];
        _.each(children, (child: any) => {
            this.children.push(child);
            child.parent = this;
        });
        return this;
    }

    /**
     * Get string representation of this node
     * 
     */
    toString(indent: number, params?: {}) {
        return super.toString(indent, params, this.children)
    }

    toCode(indent: number = -1, params?: {}) {
        return super.toCode(indent, params, this.children)
    }
}

/**
 * Root node of an AST
 * 
 * 
 */
export class RootNode extends ParentNode {
    constructor(children: Array<Node>) {
        super(children);
    }
}


/**
 * Code comment
 * 
 * 
 */
export class CommentNode extends Node {
    text: string;
    multiline: boolean;

    constructor(tokens: Array<Token>, text: string, multiline: boolean = false) {
        super(tokens);
        this.text = multiline ? text : text.trim();
        this.multiline = multiline;
    }

    /**
     * Get string representation of this node
     * 
     */
    toString(indent: number = 0) {
        return super.toString(indent, {
            multiline: this.multiline ? 'true' : 'false',
            text: JSON.stringify(this.text).replace(/"(.*)"/, '$1')
        })
    }

    toCode(indent: number = 0) {
        if (this.multiline)
            return `${this.indentToString(indent)}/* ${_.map(this.text.split('\n'), line => line.trim()).join(`\n${this.indentToString(indent)}`)} */`;
        return `${this.indentToString(indent)}// ${this.text}`;
    }
}


/**
 * Variable definition
 * 
 */
export class VariableNode extends Node {
    name: string;
    value: Value | null;

    constructor(tokens: Array<Token>, name: string, value: Value | null = null) {
        super(tokens);
        this.name = name;
        this.value = value;
    }

    /**
     * Find a node by it's token
     * 
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
     * 
     */
    toString(indent: number = 0) {
        return super.toString(indent, {
            name: this.name,
            type: this.value !== null ? this.value.className : 'null',
            value: this.value
        });
    }

    toCode(indent: number = 0) {
        return `${this.indentToString(indent)}${this.name} = ${(this.value as Value).toCode()};`;
    }
}


/**
 * Parameter definition
 * 
 */
export class ParameterNode extends VariableNode {
    constructor(tokens: Array<Token>, name: string, value: Value | null = null) {
        super(tokens, name, value);
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


/**
 * Argument definition
 * 
 */
export class ArgumentNode extends VariableNode {
    constructor(tokens: Array<Token>, value: Value, name: string | null = null) {
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


/**
 * Include statement
 * 
 */
export class IncludeNode extends Node {
    file: string;

    constructor(tokens: Array<Token>, file: string) {
        super(tokens);
        this.file = file;
    }

    /**
     * Get string representation of this node
     * 
     */
    toString(indent: number = 0) {
        return super.toString(indent, {
            file: this.file
        })
    }

    toCode(indent: number = 0) {
        return `${this.indentToString(indent)}include <${this.file}>;`;
    }
}


/**
 * Use statement
 * 
 */
export class UseNode extends IncludeNode {
    toCode(indent: number = 0) {
        return `${this.indentToString(indent)}use <${this.file}>;`;
    }
}


/**
 * Module definition
 * 
 */
export class ModuleNode extends ParentNode {
    params: Array<ParameterNode>;
    constructor(tokens: Array<Token>, name, params: Array<ParameterNode> = [], block) {
        super(block, tokens, name);
        this.params = params;
    }

    /**
     * Get string representation of this node
     * 
     */
    toString(indent: number = 0) {
        return super.toString(indent, {
            name: this.name,
            params: this.params
        });
    }

    toCode(indent: number = 0) {
        return `${this.indentToString(indent)}module ${this.name}() {${super.toCode(indent)}${this.indentToString(indent)}}`;
    }
}


/**
 * For loop statement
 * 
 */
export class ForLoopNode extends ParentNode {
    params: Array<ParameterNode>;
    constructor(tokens: Array<Token>, params: Array<ParameterNode>, block) {
        super(block, tokens);
        this.params = params;
    }
}


/**
 * Action call statement
 * 
 */
export class ActionNode extends Node {
    modifier: string;
    args: Array<ArgumentNode>;

    constructor(tokens: Array<any>, name: string, args: Array<ArgumentNode> = []) {
        super(tokens, name.replace(/([!#\*\%]?)(.*)/, '$2'));
        this.modifier = name.replace(/([!#\*\%]?)(.*)/, '$1') || '';
        this.args = args;
    }

    /**
     * Get string representation of this node
     * 
     */
    toString(indent: number = 0) {
        return super.toString(indent, {
            name: this.name,
            modifier: this.modifier,
            args: this.args.join(', ')
        });
    }

    toCode(indent: number = 0) {
        return `${this.indentToString(indent)}${this.modifier || ''}${this.name}();`;
    }
}


/**
 * Function definition
 * 
 */
export class FunctionNode extends Node {
    params: Array<ParameterNode>;
    expression: ExpressionNode | Value;
    constructor(tokens: Array<Token>, name: string, params: Array<ParameterNode>, expression: ExpressionNode | Value) {
        super(tokens, name);
        this.params = params;
        this.expression = expression;
    }

    toString(indent: number = 0) {
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

    toCode(indent: number = 0) {
        return `${this.indentToString(indent)}function ${this.name}() = ${this.expression.toCode()};`;
    }
}


/**
 * Expression
 * 
 */
export class ExpressionNode extends Node {
    leftExpression: ExpressionNode | Value;
    rightExpression: ExpressionNode | Value | null;
    operator: string | null;
    negative: boolean;
    constructor(tokens: Array<Token>, leftExpression: ExpressionNode | Value, rightExpression: ExpressionNode | Value | null = null, operator: string | null = null) {
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
     * 
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
