import { Token } from '../nearley/tokens';
import { Value } from './values';
export interface Context {
    skip(): void;
    break(): void;
    remove(): void;
    replace(node: any): void;
    parent: Node;
    depth: number;
    level: number;
    index: number;
}
export declare type DataMutator = (node: Node, context: Context) => TreeNode | undefined | null;
export declare type LayoutMutator = (node: Node | null, parent: Node) => void;
export interface TreeNode {
    getChildren(): Array<TreeNode>;
}
/**
 * Node base class
 *
 */
export declare class Node implements TreeNode {
    tokens: Array<Token>;
    name: string | null;
    constructor(tokens?: Array<Token>, name?: string);
    readonly className: any;
    getChildren(): Array<Node>;
    protected morph(dataMutator: DataMutator, layoutMutator?: LayoutMutator): Node[];
    /**
     * Find a node by it's token
     *
     */
    findByToken(token: Token): Node | null;
    /**
     * Find a node by it's type (export class name without 'Node')
     *
     */
    findByType<T>(type: {
        new (): T;
    }): Node;
    /**
     * Find a node by it's name (variables,modules,functions,actions)
     *
     */
    findByName(name: string): Node;
    /**
     * Find a node by it's value (looks in values)
     *
     *
     */
    findByValue(value: Value): any;
    /**
     * Create a string with count whitespaces
     *
     */
    indentToString(count: number): string;
    /**
     * Get string representation of children
     *
     */
    childrenToString(indent: number, children: Array<Node>): any;
    /**
     * Get string representation of params
     *
     */
    paramsToString(params: {}): string;
    /**
     * Get string representation of this node
     *
     */
    toString(indent?: number, params?: {}, children?: Array<Node>): any;
    childrenToCode(indent: number, children: Array<Node>): any;
    toCode(indent: number, children?: Array<Node>): any;
}
export declare class ParentNode extends Node {
    children: Array<Node>;
    constructor(children?: Array<Node>, tokens?: Array<Token>, name?: string);
    getChildren(): Node[];
    /**
     * Set the children of this node
     *
     */
    setChildren(children: Array<Node>): this;
    /**
     * Get string representation of this node
     *
     */
    toString(indent: number, params?: {}): any;
    toCode(indent?: number): any;
}
/**
 * Root node of an AST
 *
 *
 */
export declare class RootNode extends ParentNode {
    constructor(children: Array<Node>);
}
/**
 * Code comment
 *
 *
 */
export declare class CommentNode extends Node {
    text: string;
    multiline: boolean;
    constructor(tokens: Array<Token>, text: string, multiline?: boolean);
    /**
     * Get string representation of this node
     *
     */
    toString(indent?: number): any;
    toCode(indent?: number): string;
}
/**
 * Variable definition
 *
 */
export declare class VariableNode extends Node {
    name: string;
    value: Value;
    constructor(tokens: Array<Token>, name: string, value: Value);
    /**
     * Find a node by it's token
     *
     */
    /**
     * Get string representation of this node
     *
     */
    toString(indent?: number): any;
    toCode(indent?: number): string;
}
/**
 * Parameter definition
 *
 */
export declare class ParameterNode extends Node {
    name: string;
    value: Value | null;
    constructor(tokens: Array<Token>, name: string, value?: Value | null);
    toString(): string;
    toCode(): string;
}
/**
 * Argument definition
 *
 */
export declare class ArgumentNode extends VariableNode {
    constructor(tokens: Array<Token>, value: Value, name?: string | null);
    toString(): string;
    toCode(): string;
}
/**
 * Include statement
 *
 */
export declare class IncludeNode extends Node {
    file: string;
    constructor(tokens: Array<Token>, file: string);
    /**
     * Get string representation of this node
     *
     */
    toString(indent?: number): any;
    toCode(indent?: number): string;
}
/**
 * Use statement
 *
 */
export declare class UseNode extends IncludeNode {
    toCode(indent?: number): string;
}
/**
 * Module definition
 *
 */
export declare class ModuleNode extends ParentNode {
    params: Array<ParameterNode>;
    constructor(tokens: Array<Token>, name: any, params: ParameterNode[] | undefined, block: any);
    /**
     * Get string representation of this node
     *
     */
    toString(indent?: number): any;
    toCode(indent?: number): string;
}
/**
 * For loop statement
 *
 */
export declare class ForLoopNode extends ParentNode {
    params: Array<ParameterNode>;
    constructor(tokens: Array<Token>, params: Array<ParameterNode>, block: any);
}
/**
 * Action call statement
 *
 */
export declare class ActionNode extends ParentNode {
    modifier: string;
    args: Array<ArgumentNode>;
    constructor(tokens: Array<any>, name: string, args?: Array<ArgumentNode>);
    /**
     * Get string representation of this node
     *
     */
    toString(indent?: number): any;
    toCode(indent?: number): string;
}
/**
 * Function definition
 *
 */
export declare class FunctionNode extends Node {
    params: Array<ParameterNode>;
    expression: ExpressionNode | Value;
    constructor(tokens: Array<Token>, name: string, params: Array<ParameterNode>, expression: ExpressionNode | Value);
    toString(indent?: number): any;
    toCode(indent?: number): string;
}
/**
 * Expression
 *
 */
export declare class ExpressionNode extends Node {
    leftExpression: ExpressionNode | Value;
    rightExpression: ExpressionNode | Value | null;
    operator: string | null;
    negative: boolean;
    constructor(tokens: Array<Token>, leftExpression: ExpressionNode | Value, rightExpression?: ExpressionNode | Value | null, operator?: string | null);
    /**
     * Turn this expression negative
     *
     */
    setNegative(neg: any): this;
    toString(): any;
    toCode(): any;
}
