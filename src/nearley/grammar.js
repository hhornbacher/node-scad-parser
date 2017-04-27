// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
	
/**
 * Nearley SCAD grammar
 * @module nearley/grammar
 */

require('./tokens')();
require('../ast');

const pickTokens = (match) => _.filter(match, token => {
	if(token.constructor.name === 'Object')
		return true;
	return false;
});

var grammar = {
    ParserRules: [
    {"name": "Block", "symbols": ["Statement"]},
    {"name": "Block", "symbols": ["Block", "Statement"], "postprocess": d => _.concat(d[0], d[1])},
    {"name": "Statement", "symbols": [comment], "postprocess": d => new CommentNode(pickTokens(d), d[0].value)},
    {"name": "Statement", "symbols": [mlComment], "postprocess": d => new CommentNode(pickTokens(d), d[0].value, true)},
    {"name": "Statement", "symbols": [include, eos], "postprocess": d => new IncludeNode(pickTokens(d), d[0].value)},
    {"name": "Statement", "symbols": [use, eos], "postprocess": d => new UseNode(pickTokens(d), d[0].value)},
    {"name": "Statement", "symbols": [moduleDefinition, rparent, lblock, "Block", rblock], "postprocess": d => new ModuleNode(pickTokens(d), d[0].value, d[3])},
    {"name": "Statement", "symbols": [moduleDefinition, "Parameters", rparent, lblock, "Block", rblock], "postprocess": d => new ModuleNode(pickTokens(d), d[0].value, d[1], d[4])},
    {"name": "Statement", "symbols": [functionDefinition, rparent, assign, "Expression", eos], "postprocess": d => new FunctionNode(pickTokens(d), d[0].value, null, d[3])},
    {"name": "Statement", "symbols": [functionDefinition, "Parameters", rparent, assign, "Expression", eos], "postprocess": d => new FunctionNode(pickTokens(d), d[0].value, d[1], d[4])},
    {"name": "Statement", "symbols": [identifier, assign, "Expression", eos], "postprocess": d => new VariableNode(pickTokens(d), d[0].value, d[2])},
    {"name": "Statement", "symbols": ["ModuleInstantiation"], "postprocess": id},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "ChildrenInstantiation"], "postprocess": d => d[0].setChildren(d[1])},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", eos], "postprocess": id},
    {"name": "ChildrenInstantiation", "symbols": [lblock, "Block", rblock], "postprocess": d => d[1]},
    {"name": "ChildrenInstantiation", "symbols": ["ModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [actionCall, rparent], "postprocess": d => new ActionNode(pickTokens(d), d[0].value)},
    {"name": "SingleModuleInstantiation", "symbols": [actionCall, "Arguments", rparent], "postprocess": d => new ActionNode(pickTokens(d), d[0].value, d[1])},
    {"name": "Expression", "symbols": [bool_true], "postprocess": d => new BooleanValue(pickTokens(d), true)},
    {"name": "Expression", "symbols": [bool_false], "postprocess": d => new BooleanValue(pickTokens(d), false)},
    {"name": "Expression", "symbols": [identifier], "postprocess": d => new ReferenceValue(pickTokens(d), d[0].value)},
    {"name": "Expression", "symbols": [float], "postprocess": d => new NumberValue(pickTokens(d), d[0].value)},
    {"name": "Expression", "symbols": [string], "postprocess": d => new StringValue(pickTokens(d), d[0].value)},
    {"name": "Expression", "symbols": [lparent, "Expression", rparent], "postprocess": d => new ExpressionNode(pickTokens(d), d[1])},
    {"name": "Expression", "symbols": [lvect, "Expression", seperator, "Expression", rvect], "postprocess": d => new RangeValue(pickTokens(d), d[1], d[3])},
    {"name": "Expression", "symbols": [lvect, "Expression", seperator, "Expression", seperator, "Expression", rvect], "postprocess": d => new RangeValue(pickTokens(d), d[1], d[5], d[3])},
    {"name": "Expression", "symbols": [lvect, "VectorExpression", rvect], "postprocess": d => new VectorValue(pickTokens(d), d[1])},
    {"name": "Expression", "symbols": ["Expression", operator1, "Expression"], "postprocess": d => new ExpressionNode(pickTokens(d), d[0], d[2], d[1])},
    {"name": "Expression", "symbols": ["Expression", operator2, "Expression"], "postprocess": d => new ExpressionNode(pickTokens(d), d[0], d[2], d[1])},
    {"name": "Expression", "symbols": ["Expression", operator3, "Expression"], "postprocess": d => new ExpressionNode(pickTokens(d), d[0], d[2], d[1])},
    {"name": "Expression", "symbols": [operator2, "Expression"], "postprocess":  d => {
        	if(d[0].value === '-')
        		return d[1].setNegative(true);
        } },
    {"name": "Parameters", "symbols": ["Parameter"], "postprocess": id},
    {"name": "Parameters", "symbols": ["Parameters", comma, "Parameter"], "postprocess": d => _.concat(d[0], [d[2]])},
    {"name": "Parameter", "symbols": [identifier], "postprocess": id},
    {"name": "Parameter", "symbols": [identifier, assign, "Expression"], "postprocess": d => ([d[0], d[2]])},
    {"name": "VectorExpression$ebnf$1", "symbols": [comment], "postprocess": id},
    {"name": "VectorExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorExpression$ebnf$2", "symbols": [comment], "postprocess": id},
    {"name": "VectorExpression$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorExpression", "symbols": ["VectorExpression$ebnf$1", "Expression", "VectorExpression$ebnf$2"], "postprocess": d => ([d[1]])},
    {"name": "VectorExpression$ebnf$3", "symbols": [comment], "postprocess": id},
    {"name": "VectorExpression$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorExpression$ebnf$4", "symbols": [comment], "postprocess": id},
    {"name": "VectorExpression$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorExpression", "symbols": ["VectorExpression", comma, "VectorExpression$ebnf$3", "Expression", "VectorExpression$ebnf$4"], "postprocess": d => _.concat(d[0], [d[3]])},
    {"name": "Arguments", "symbols": ["Argument"], "postprocess": id},
    {"name": "Arguments", "symbols": ["Arguments", comma, "Argument"], "postprocess": d => _.concat(d[0], [d[2]])},
    {"name": "Argument", "symbols": ["Expression"], "postprocess": id},
    {"name": "Argument", "symbols": [identifier, assign, "Expression"], "postprocess": d => ([d[0], d[4]])}
]
  , ParserStart: "Block"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
