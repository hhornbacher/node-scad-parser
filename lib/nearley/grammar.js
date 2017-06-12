"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
function id(d) { return d[0]; }
/**
 * Nearley SCAD grammar
 * @module nearley/grammar
 */
const _ = require("lodash");
const tokens_1 = require("./tokens");
const ast_1 = require("../ast");
const { include, use, moduleDefinition, functionDefinition, actionCall, comment, mlComment, comma, seperator, lvect, rvect, lparent, rparent, lblock, rblock, bool_true, bool_false, operator1, operator2, operator3, assign, identifier, string, float, eos } = tokens_1.tokenRules;
const pickTokens = (match) => _.filter(match, (token) => {
    if (token.constructor.name === 'Object')
        return true;
    return false;
});
;
;
;
exports.Lexer = undefined;
exports.ParserRules = [
    { "name": "Block", "symbols": ["Statement"] },
    { "name": "Block", "symbols": ["Block", "Statement"], "postprocess": d => _.concat(d[0], d[1]) },
    { "name": "Statement", "symbols": [comment], "postprocess": d => new ast_1.CommentNode(pickTokens(d), d[0].value) },
    { "name": "Statement", "symbols": [mlComment], "postprocess": d => new ast_1.CommentNode(pickTokens(d), d[0].value, true) },
    { "name": "Statement", "symbols": [include, eos], "postprocess": d => new ast_1.IncludeNode(pickTokens(d), d[0].value) },
    { "name": "Statement", "symbols": [use, eos], "postprocess": d => new ast_1.UseNode(pickTokens(d), d[0].value) },
    { "name": "Statement", "symbols": [moduleDefinition, rparent, lblock, "Block", rblock], "postprocess": d => new ast_1.ModuleNode(pickTokens(d), d[0].value, [], d[3]) },
    { "name": "Statement", "symbols": [moduleDefinition, "Parameters", rparent, lblock, "Block", rblock], "postprocess": d => new ast_1.ModuleNode(pickTokens(d), d[0].value, d[1], d[4]) },
    { "name": "Statement", "symbols": [functionDefinition, rparent, assign, "Expression", eos], "postprocess": d => new ast_1.FunctionNode(pickTokens(d), d[0].value, [], d[3]) },
    { "name": "Statement", "symbols": [functionDefinition, "Parameters", rparent, assign, "Expression", eos], "postprocess": d => new ast_1.FunctionNode(pickTokens(d), d[0].value, d[1], d[4]) },
    { "name": "Statement", "symbols": [identifier, assign, "Expression", eos], "postprocess": d => new ast_1.VariableNode(pickTokens(d), d[0].value, d[2]) },
    { "name": "Statement", "symbols": ["ModuleInstantiation"], "postprocess": id },
    { "name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", eos], "postprocess": id },
    { "name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", lblock, "Block", rblock], "postprocess": d => d[0].setChildren(d[2]) },
    { "name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "ModuleInstantiation"], "postprocess": d => d[0].setChildren([d[1]]) },
    { "name": "SingleModuleInstantiation", "symbols": [actionCall, rparent], "postprocess": d => new ast_1.ActionNode(pickTokens(d), d[0].value) },
    { "name": "SingleModuleInstantiation", "symbols": [actionCall, "Arguments", rparent], "postprocess": d => new ast_1.ActionNode(pickTokens(d), d[0].value, d[1]) },
    { "name": "Expression", "symbols": [bool_true], "postprocess": d => new ast_1.BooleanValue(pickTokens(d), true) },
    { "name": "Expression", "symbols": [bool_false], "postprocess": d => new ast_1.BooleanValue(pickTokens(d), false) },
    { "name": "Expression", "symbols": [identifier], "postprocess": d => new ast_1.ReferenceValue(pickTokens(d), d[0].value) },
    { "name": "Expression", "symbols": [float], "postprocess": d => new ast_1.NumberValue(pickTokens(d), d[0].value) },
    { "name": "Expression", "symbols": [string], "postprocess": d => new ast_1.StringValue(pickTokens(d), d[0].value) },
    { "name": "Expression", "symbols": [lparent, "Expression", rparent], "postprocess": d => new ast_1.ExpressionNode(pickTokens(d), d[1]) },
    { "name": "Expression", "symbols": [lvect, "Expression", seperator, "Expression", rvect], "postprocess": d => new ast_1.RangeValue(pickTokens(d), d[1], d[3]) },
    { "name": "Expression", "symbols": [lvect, "Expression", seperator, "Expression", seperator, "Expression", rvect], "postprocess": d => new ast_1.RangeValue(pickTokens(d), d[1], d[5], d[3]) },
    { "name": "Expression", "symbols": [lvect, "VectorExpression", rvect], "postprocess": d => new ast_1.VectorValue(pickTokens(d), d[1]) },
    { "name": "Expression", "symbols": ["Expression", operator1, "Expression"], "postprocess": d => new ast_1.ExpressionNode(pickTokens(d), d[0], d[2], d[1]) },
    { "name": "Expression", "symbols": ["Expression", operator2, "Expression"], "postprocess": d => new ast_1.ExpressionNode(pickTokens(d), d[0], d[2], d[1]) },
    { "name": "Expression", "symbols": ["Expression", operator3, "Expression"], "postprocess": d => new ast_1.ExpressionNode(pickTokens(d), d[0], d[2], d[1]) },
    { "name": "Expression", "symbols": [operator2, "Expression"], "postprocess": d => {
            if (d[0].value === '-')
                return d[1].setNegative(true);
        } },
    { "name": "Parameters", "symbols": ["Parameter"], "postprocess": id },
    { "name": "Parameters", "symbols": ["Parameters", comma, "Parameter"], "postprocess": d => _.concat(d[0], [d[2]]) },
    { "name": "Parameter", "symbols": [identifier], "postprocess": d => new ast_1.ParameterNode(pickTokens(d), d[0].value) },
    { "name": "Parameter", "symbols": [identifier, assign, "Expression"], "postprocess": d => new ast_1.ParameterNode(pickTokens(d), d[0].value, d[2]) },
    { "name": "VectorExpression$ebnf$1", "symbols": [comment], "postprocess": id },
    { "name": "VectorExpression$ebnf$1", "symbols": [], "postprocess": () => null },
    { "name": "VectorExpression$ebnf$2", "symbols": [comment], "postprocess": id },
    { "name": "VectorExpression$ebnf$2", "symbols": [], "postprocess": () => null },
    { "name": "VectorExpression", "symbols": ["VectorExpression$ebnf$1", "Expression", "VectorExpression$ebnf$2"], "postprocess": d => ([d[1]]) },
    { "name": "VectorExpression$ebnf$3", "symbols": [comment], "postprocess": id },
    { "name": "VectorExpression$ebnf$3", "symbols": [], "postprocess": () => null },
    { "name": "VectorExpression$ebnf$4", "symbols": [comment], "postprocess": id },
    { "name": "VectorExpression$ebnf$4", "symbols": [], "postprocess": () => null },
    { "name": "VectorExpression", "symbols": ["VectorExpression", comma, "VectorExpression$ebnf$3", "Expression", "VectorExpression$ebnf$4"], "postprocess": d => _.concat(d[0], [d[3]]) },
    { "name": "Arguments", "symbols": ["Argument"], "postprocess": id },
    { "name": "Arguments", "symbols": ["Arguments", comma, "Argument"], "postprocess": d => _.concat(d[0], [d[2]]) },
    { "name": "Argument", "symbols": ["Expression"], "postprocess": d => new ast_1.ArgumentNode(pickTokens(d), d[0]) },
    { "name": "Argument", "symbols": [identifier, assign, "Expression"], "postprocess": d => new ast_1.ArgumentNode(pickTokens(d), d[2], d[0].value) }
];
exports.ParserStart = "Block";
//# sourceMappingURL=grammar.js.map