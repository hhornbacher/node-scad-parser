// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
	
const nm = require('./nearley-moo');
nm(require('./state-start.js'));
nm(require('./state-comment.js'));


require('../ast');

var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "RootNode", "symbols": ["Block"], "postprocess": d => new RootNode(d[0])},
    {"name": "Block", "symbols": ["Statement"]},
    {"name": "Block", "symbols": ["Block", "Statement"], "postprocess": d => _.concat(d[0], d[1])},
    {"name": "Statement", "symbols": [comment], "postprocess": d => new CommentNode(d[0].value)},
    {"name": "Statement", "symbols": [lcomment, icomment, rcomment], "postprocess": d => new CommentNode(d[1].value, true)},
    {"name": "Statement", "symbols": [keyword_include, lpath, path, rpath, eos], "postprocess": d => new IncludeNode(d[2].value)},
    {"name": "Statement", "symbols": [keyword_use, lpath, path, rpath, eos], "postprocess": d => new UseNode(d[2].value)},
    {"name": "Statement$ebnf$1", "symbols": ["Parameters"], "postprocess": id},
    {"name": "Statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Statement", "symbols": [keyword_module, identifier, lparent, "Statement$ebnf$1", rparent], "postprocess": d => new ModuleNode(d[1].value, d[3]/*, d[10]*/)},
    {"name": "Statement$ebnf$2", "symbols": ["Parameters"], "postprocess": id},
    {"name": "Statement$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Statement", "symbols": [keyword_function, identifier, lparent, "Statement$ebnf$2", rparent, assign, "Expression", eos], "postprocess": d => new FunctionNode(d[2]/*, d[6], d[12]*/)},
    {"name": "Statement", "symbols": [lblock, "Block", rblock], "postprocess": d => d[1]},
    {"name": "Statement", "symbols": [identifier, assign, "Expression", eos], "postprocess": d => new VariableNode(d[0].value, d[2])},
    {"name": "Statement", "symbols": ["ModuleInstantiation"], "postprocess": id},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "ChildrenInstantiation"], "postprocess": d => d[0].setChildren(d[1])},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", eos], "postprocess": id},
    {"name": "ChildrenInstantiation", "symbols": [lblock, "Block", rblock], "postprocess": d => d[1]},
    {"name": "ChildrenInstantiation", "symbols": ["ModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [identifier, lparent, rparent], "postprocess": d => new ActionNode(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [identifier, lparent, "Arguments", rparent], "postprocess": d => new ActionNode(d[0], d[4])},
    {"name": "SingleModuleInstantiation", "symbols": [identifier, seperator, "SingleModuleInstantiation"], "postprocess": d => d[3].setLabel(d[0])},
    {"name": "Expression", "symbols": [keyword_true], "postprocess": () => new BooleanValue(true)},
    {"name": "Expression", "symbols": [keyword_false], "postprocess": () => new BooleanValue(false)},
    {"name": "Expression", "symbols": [identifier], "postprocess": d => new ReferenceValue(d[0].value)},
    {"name": "Expression", "symbols": [float], "postprocess": d => new NumberValue(d[0].value)},
    {"name": "Expression", "symbols": [string], "postprocess": d => new StringValue(d[0].value)},
    {"name": "Expression", "symbols": [lparent, "Expression", rparent], "postprocess": d => new ExpressionNode(d[1])},
    {"name": "Expression", "symbols": [lvect, "Expression", seperator, "Expression", rvect], "postprocess": d => new RangeValue(d[1], d[3])},
    {"name": "Expression", "symbols": [lvect, "Expression", seperator, "Expression", seperator, "Expression", rvect], "postprocess": d => new RangeValue(d[1], d[5], d[3])},
    {"name": "Expression", "symbols": [lvect, "VectorExpression", rvect], "postprocess": d => new VectorValue(d[1])},
    {"name": "Expression", "symbols": ["Expression", operator1, "Expression"], "postprocess": d => new ExpressionNode(d[0], d[2], d[1])},
    {"name": "Expression", "symbols": ["Expression", operator2, "Expression"], "postprocess": d => new ExpressionNode(d[0], d[2], d[1])},
    {"name": "Expression", "symbols": ["Expression", operator3, "Expression"], "postprocess": d => new ExpressionNode(d[0], d[2], d[1])},
    {"name": "Expression", "symbols": [operator2, "Expression"], "postprocess":  d => {
        	if(_.isNumber(d[1]) && d[0].value === '-')
        		return -d[1];
        	else if(d[0].value === '-')
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
  , ParserStart: "RootNode"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
