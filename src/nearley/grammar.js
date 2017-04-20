// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
	
const nm = require('./nearley-moo');
nm(require('./state-start.js'));
nm(require('./state-comment.js'));


require('../ast');

let counter=0;

var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "Block", "symbols": ["Statement"]},
    {"name": "Block", "symbols": ["Block", "Statement"], "postprocess": d => _.concat(d[0], d[1])},
    {"name": "Statement", "symbols": [eol], "postprocess": () => null},
    {"name": "Statement", "symbols": [comment], "postprocess": d => new CommentNode(d[0].value)},
    {"name": "Statement$ebnf$1", "symbols": [eol], "postprocess": id},
    {"name": "Statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Statement$ebnf$2", "symbols": [eol], "postprocess": id},
    {"name": "Statement$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Statement", "symbols": [lcomment, "Statement$ebnf$1", icomment, "Statement$ebnf$2", rcomment], "postprocess": d => new CommentNode(d[2].value, true)},
    {"name": "Statement", "symbols": [keyword_include, lpath, path, rpath, eos], "postprocess": d => new IncludeNode(d[2].value)},
    {"name": "Statement", "symbols": [keyword_use, lpath, path, rpath, eos], "postprocess": d => new UseNode(d[2].value)},
    {"name": "Statement$ebnf$3", "symbols": ["Parameters"], "postprocess": id},
    {"name": "Statement$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Statement", "symbols": [keyword_module, identifier, lparent, "Statement$ebnf$3", rparent], "postprocess": d => new ModuleNode(d[1].value, d[3]/*, d[10]*/)},
    {"name": "Statement", "symbols": [identifier, assign, "Expression", eos], "postprocess": d => new VariableNode(d[0].value, d[2])},
    {"name": "Expression", "symbols": [keyword_true], "postprocess": () => new BooleanValue(true)},
    {"name": "Expression", "symbols": [keyword_false], "postprocess": () => new BooleanValue(false)},
    {"name": "Expression", "symbols": [identifier], "postprocess": d => new ReferenceValue(d[0].value)},
    {"name": "Expression", "symbols": [float], "postprocess": d => new NumberValue(d[0].value)},
    {"name": "Expression", "symbols": [string], "postprocess": d => new StringValue(d[0].value)},
    {"name": "Parameters", "symbols": ["Parameter"], "postprocess": id},
    {"name": "Parameters", "symbols": ["Parameters", comma, "Parameter"], "postprocess": d => _.concat(d[0], [d[4]])},
    {"name": "Parameter", "symbols": [identifier], "postprocess": id},
    {"name": "RootNode", "symbols": ["Block"], "postprocess": d => new RootNode(d[0])},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "ChildrenInstantiation"], "postprocess": d => d[0].setChildren(d[1])},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", eos], "postprocess": id},
    {"name": "ChildrenInstantiation", "symbols": [lblock, "Block", rblock], "postprocess": d => d[2]},
    {"name": "ChildrenInstantiation", "symbols": ["ModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [identifier, lparent, rparent], "postprocess": d => new ActionNode(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [identifier, lparent, "Arguments", rparent], "postprocess": d => new ActionNode(d[0], d[4])},
    {"name": "SingleModuleInstantiation", "symbols": [identifier, seperator, "SingleModuleInstantiation"], "postprocess": d => d[3].setLabel(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [modifier, "SingleModuleInstantiation"], "postprocess": d => d[1].setModifier(d[0])},
    {"name": "VectorExpression", "symbols": ["Expression"]},
    {"name": "VectorExpression", "symbols": ["VectorExpression", comma, "Expression"], "postprocess":  d => {
        	console.log(d[0], d[4]);
        	counter++;
        	if(counter>10)
        		process.exit(0);
        	return d[0].push(d[4]); 
        } },
    {"name": "Arguments", "symbols": ["Argument"], "postprocess": id},
    {"name": "Arguments", "symbols": ["Arguments", comma, "Argument"], "postprocess": d => _.concat(d[0], [d[4]])},
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
