"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract nodes of the scad language
 */
var _ = require("lodash");
var morph = require("tree-morph");
/**
 * Node base class
 *
 */
var Node = (function () {
    function Node(tokens, name) {
        if (tokens === void 0) { tokens = []; }
        this.tokens = tokens;
        this.name = name || null;
    }
    Object.defineProperty(Node.prototype, "className", {
        get: function () {
            var instance = this.constructor;
            return instance.name;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.getChildren = function () {
        return [];
    };
    Node.prototype.morph = function (dataMutator, layoutMutator) {
        if (layoutMutator === void 0) { layoutMutator = function () { }; }
        return morph(this, dataMutator, layoutMutator);
    };
    /**
     * Find a node by it's token
     *
     */
    Node.prototype.findByToken = function (token) {
        return this.morph(function (node) {
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
    };
    /**
     * Find a node by it's type (export class name without 'Node')
     *
     */
    Node.prototype.findByType = function (type) {
        return this.morph(function (node) {
            if (node instanceof type)
                return node;
        })[0] || null;
        /*        let nodes = _.filter(this.children, child => child instanceof type);
                _.each(this.children, child => {
                    nodes = _.concat(nodes, child.findByType(type));
                });
                return nodes;*/
    };
    /**
     * Find a node by it's name (variables,modules,functions,actions)
     *
     */
    Node.prototype.findByName = function (name) {
        return this.morph(function (node) {
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
    };
    /**
     * Find a node by it's value (looks in values)
     *
     *
     */
    Node.prototype.findByValue = function (value) {
        return this.morph(function (node) {
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
    };
    /**
     * Create a string with count whitespaces
     *
     */
    Node.prototype.indentToString = function (count) {
        return _.join(_.times(count * 2, function () { return ' '; }), '');
    };
    /**
     * Get string representation of children
     *
     */
    Node.prototype.childrenToString = function (indent, children) {
        if (children.length > 0)
            return '\n'
                + _.join(_.map(children, function (child) { return child.toString(indent + 1) + '\n'; }), '')
                + this.indentToString(indent);
        return null;
    };
    /**
     * Get string representation of params
     *
     */
    Node.prototype.paramsToString = function (params) {
        return _.join(_.map(params, function (val, name) { return val !== null ? ' ' + name + '="' + val.toString() + '"' : ''; }), '');
    };
    /**
     * Get string representation of this node
     *
     */
    Node.prototype.toString = function (indent, params, children) {
        if (indent === void 0) { indent = 0; }
        if (params === void 0) { params = {}; }
        if (children === void 0) { children = []; }
        var childrenString = this.childrenToString(indent, children);
        if (childrenString)
            return this.indentToString(indent) + "<" + this.className.replace('Node', '') + this.paramsToString(params) + ">" + childrenString + "</" + this.className.replace('Node', '') + ">";
        return this.indentToString(indent) + "<" + this.className.replace('Node', '') + this.paramsToString(params) + " />";
    };
    Node.prototype.childrenToCode = function (indent, children) {
        if (children.length > 0)
            return '\n'
                + _.join(_.map(children, function (child) { return child.toCode(indent + 1) + '\n'; }), '')
                + this.indentToString(indent);
        return '';
    };
    Node.prototype.toCode = function (indent, /*params?: {},*/ children) {
        if (children === void 0) { children = []; }
        return "" + this.indentToString(indent) + this.childrenToCode(indent, children);
    };
    return Node;
}());
exports.Node = Node;
var ParentNode = (function (_super) {
    __extends(ParentNode, _super);
    function ParentNode(children, tokens, name) {
        if (children === void 0) { children = []; }
        if (tokens === void 0) { tokens = []; }
        var _this = _super.call(this, tokens, name) || this;
        _this.children = children;
        return _this;
    }
    ParentNode.prototype.getChildren = function () {
        return this.children;
    };
    /**
     * Set the children of this node
     *
     */
    ParentNode.prototype.setChildren = function (children) {
        var _this = this;
        children = _.filter(children, function (x) { return !!x; });
        this.children = [];
        _.each(children, function (child) {
            _this.children.push(child);
            //child.parent = this;
        });
        return this;
    };
    /**
     * Get string representation of this node
     *
     */
    ParentNode.prototype.toString = function (indent, params) {
        return _super.prototype.toString.call(this, indent, params, this.children);
    };
    ParentNode.prototype.toCode = function (indent /*, params?: {}*/) {
        if (indent === void 0) { indent = -1; } /*, params?: {}*/
        return _super.prototype.toCode.call(this, indent, /*params,*/ this.children);
    };
    return ParentNode;
}(Node));
exports.ParentNode = ParentNode;
/**
 * Root node of an AST
 *
 *
 */
var RootNode = (function (_super) {
    __extends(RootNode, _super);
    function RootNode(children) {
        return _super.call(this, children) || this;
    }
    return RootNode;
}(ParentNode));
exports.RootNode = RootNode;
/**
 * Code comment
 *
 *
 */
var CommentNode = (function (_super) {
    __extends(CommentNode, _super);
    function CommentNode(tokens, text, multiline) {
        if (multiline === void 0) { multiline = false; }
        var _this = _super.call(this, tokens) || this;
        _this.text = multiline ? text : text.trim();
        _this.multiline = multiline;
        return _this;
    }
    /**
     * Get string representation of this node
     *
     */
    CommentNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        return _super.prototype.toString.call(this, indent, {
            multiline: this.multiline ? 'true' : 'false',
            text: JSON.stringify(this.text).replace(/"(.*)"/, '$1')
        });
    };
    CommentNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        if (this.multiline)
            return this.indentToString(indent) + "/* " + _.join(_.map(this.text.split('\n'), function (line) { return line.trim(); }), "\n" + this.indentToString(indent)) + " */";
        return this.indentToString(indent) + "// " + this.text;
    };
    return CommentNode;
}(Node));
exports.CommentNode = CommentNode;
/**
 * Variable definition
 *
 */
var VariableNode = (function (_super) {
    __extends(VariableNode, _super);
    function VariableNode(tokens, name, value) {
        var _this = _super.call(this, tokens) || this;
        _this.name = name;
        _this.value = value;
        return _this;
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
    VariableNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        return _super.prototype.toString.call(this, indent, {
            name: this.name,
            type: this.value !== null ? this.value.className : 'null',
            value: this.value
        });
    };
    VariableNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        return "" + this.indentToString(indent) + this.name + " = " + this.value.toCode() + ";";
    };
    return VariableNode;
}(Node));
exports.VariableNode = VariableNode;
/**
 * Parameter definition
 *
 */
var ParameterNode = (function (_super) {
    __extends(ParameterNode, _super);
    function ParameterNode(tokens, name, value) {
        if (value === void 0) { value = null; }
        var _this = _super.call(this, tokens) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    ParameterNode.prototype.toString = function () {
        if (this.value)
            return this.name + " = " + this.value.toString();
        return "" + this.name;
    };
    ParameterNode.prototype.toCode = function () {
        if (this.name)
            return this.name + " = " + (this.value !== null ? this.value.toCode() : 'null');
        return "" + this.name;
    };
    return ParameterNode;
}(Node));
exports.ParameterNode = ParameterNode;
/**
 * Argument definition
 *
 */
var ArgumentNode = (function (_super) {
    __extends(ArgumentNode, _super);
    function ArgumentNode(tokens, value, name) {
        if (name === void 0) { name = null; }
        return _super.call(this, tokens, name || '', value) || this;
    }
    ArgumentNode.prototype.toString = function () {
        if (this.name)
            return this.name + " = " + (this.value !== null ? this.value.toString() : '');
        return "" + (this.value !== null ? this.value.toString() : '');
    };
    ArgumentNode.prototype.toCode = function () {
        if (this.name)
            return this.name + " = " + (this.value !== null ? this.value.toString() : '');
        return "" + (this.value !== null ? this.value.toString() : '');
    };
    return ArgumentNode;
}(VariableNode));
exports.ArgumentNode = ArgumentNode;
/**
 * Include statement
 *
 */
var IncludeNode = (function (_super) {
    __extends(IncludeNode, _super);
    function IncludeNode(tokens, file) {
        var _this = _super.call(this, tokens) || this;
        _this.file = file;
        return _this;
    }
    /**
     * Get string representation of this node
     *
     */
    IncludeNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        return _super.prototype.toString.call(this, indent, {
            file: this.file
        });
    };
    IncludeNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        return this.indentToString(indent) + "include <" + this.file + ">;";
    };
    return IncludeNode;
}(Node));
exports.IncludeNode = IncludeNode;
/**
 * Use statement
 *
 */
var UseNode = (function (_super) {
    __extends(UseNode, _super);
    function UseNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UseNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        return this.indentToString(indent) + "use <" + this.file + ">;";
    };
    return UseNode;
}(IncludeNode));
exports.UseNode = UseNode;
/**
 * Module definition
 *
 */
var ModuleNode = (function (_super) {
    __extends(ModuleNode, _super);
    function ModuleNode(tokens, name, params, block) {
        if (params === void 0) { params = []; }
        var _this = _super.call(this, block, tokens, name) || this;
        _this.params = params;
        return _this;
    }
    /**
     * Get string representation of this node
     *
     */
    ModuleNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        return _super.prototype.toString.call(this, indent, {
            name: this.name,
            params: this.params
        });
    };
    ModuleNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        return this.indentToString(indent) + "module " + this.name + "() {" + _super.prototype.toCode.call(this, indent) + this.indentToString(indent) + "}";
    };
    return ModuleNode;
}(ParentNode));
exports.ModuleNode = ModuleNode;
/**
 * For loop statement
 *
 */
var ForLoopNode = (function (_super) {
    __extends(ForLoopNode, _super);
    function ForLoopNode(tokens, params, block) {
        var _this = _super.call(this, block, tokens) || this;
        _this.params = params;
        return _this;
    }
    return ForLoopNode;
}(ParentNode));
exports.ForLoopNode = ForLoopNode;
/**
 * Action call statement
 *
 */
var ActionNode = (function (_super) {
    __extends(ActionNode, _super);
    function ActionNode(tokens, name, args) {
        if (args === void 0) { args = []; }
        var _this = _super.call(this, [], tokens, name.replace(/([!#\*\%]?)(.*)/, '$2')) || this;
        _this.modifier = name.replace(/([!#\*\%]?)(.*)/, '$1') || '';
        _this.args = args;
        return _this;
    }
    /**
     * Get string representation of this node
     *
     */
    ActionNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        return _super.prototype.toString.call(this, indent, {
            name: this.name,
            modifier: this.modifier,
            args: _.join(this.args, ', ')
        });
    };
    ActionNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        return "" + this.indentToString(indent) + (this.modifier || '') + this.name + "();";
    };
    return ActionNode;
}(ParentNode));
exports.ActionNode = ActionNode;
/**
 * Function definition
 *
 */
var FunctionNode = (function (_super) {
    __extends(FunctionNode, _super);
    function FunctionNode(tokens, name, params, expression) {
        var _this = _super.call(this, tokens, name) || this;
        _this.params = params;
        _this.expression = expression;
        return _this;
    }
    FunctionNode.prototype.toString = function (indent) {
        if (indent === void 0) { indent = 0; }
        var params = {
            name: this.name,
            params: this.params
        };
        if (this.params && this.params.length > 0)
            params.params = this.params;
        return _super.prototype.toString.call(this, indent, {
            name: this.name,
            params: this.params
        });
    };
    FunctionNode.prototype.toCode = function (indent) {
        if (indent === void 0) { indent = 0; }
        return this.indentToString(indent) + "function " + this.name + "() = " + this.expression.toCode() + ";";
    };
    return FunctionNode;
}(Node));
exports.FunctionNode = FunctionNode;
/**
 * Expression
 *
 */
var ExpressionNode = (function (_super) {
    __extends(ExpressionNode, _super);
    function ExpressionNode(tokens, leftExpression, rightExpression, operator) {
        if (rightExpression === void 0) { rightExpression = null; }
        if (operator === void 0) { operator = null; }
        var _this = _super.call(this, tokens) || this;
        _this.leftExpression = leftExpression;
        _this.rightExpression = rightExpression;
        _this.operator = operator;
        _this.negative = false;
        return _this;
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
    ExpressionNode.prototype.setNegative = function (neg) {
        this.negative = neg;
        return this;
    };
    ExpressionNode.prototype.toString = function () {
        if (this.rightExpression === null)
            return "" + (this.negative ? '-' : '') + this.leftExpression.toString();
        if (this.rightExpression !== null && this.operator !== null)
            return (this.negative ? '-' : '') + "(" + this.leftExpression.toString() + this.operator + this.rightExpression.toString() + ")";
    };
    ExpressionNode.prototype.toCode = function () {
        if (this.rightExpression === null)
            return "" + (this.negative ? '-' : '') + this.leftExpression.toCode();
        if (this.rightExpression !== null && this.operator !== null)
            return (this.negative ? '-' : '') + "(" + this.leftExpression.toCode() + this.operator + this.rightExpression.toCode() + ")";
    };
    return ExpressionNode;
}(Node));
exports.ExpressionNode = ExpressionNode;
//# sourceMappingURL=nodes.js.map