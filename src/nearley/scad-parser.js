// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
    require('../ast');

	const tok_module = {literal: "module"},
		tok_function = {literal: "function"};

	const tok_true = {literal: "true"},
		tok_false = {literal: "false"};

	const tok_include = {literal: "include"},
		tok_use = {literal: "use"};

	const tok_le = {literal: "<="},
		tok_ge = {literal: ">="},
		tok_eq = {literal: "=="};
var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "RootNode", "symbols": ["Block"]},
    {"name": "Block", "symbols": []},
    {"name": "Block", "symbols": ["Statement", "Block"]},
    {"name": "Statement", "symbols": [{"literal":";"}]},
    {"name": "Statement$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement$ebnf$1", "symbols": []},
    {"name": "Statement$ebnf$1", "symbols": ["Statement$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Statement", "symbols": ["Statement$string$1", "Statement$ebnf$1", {"literal":"\n"}]},
    {"name": "Statement", "symbols": ["ModuleInstantiation"]},
    {"name": "Statement", "symbols": [{"literal":"{"}, "Block", {"literal":"}"}]},
    {"name": "Statement", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression", "_", {"literal":";"}, "_"]},
    {"name": "Statement", "symbols": [tok_module, "__", "Identifier", "_", {"literal":"("}, "_", "Parameters", "_", {"literal":")"}, "_", "Statement", "__"]},
    {"name": "Statement", "symbols": [tok_function, "__", "Identifier", "_", {"literal":"("}, "_", "Parameters", "_", {"literal":")"}, "_", {"literal":"="}, "_", "Expression", "__"]},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "_", {"literal":";"}]},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "ChildrenInstantiation"]},
    {"name": "ModuleInstantiationList", "symbols": []},
    {"name": "ModuleInstantiationList", "symbols": ["ModuleInstantiationList", "ModuleInstantiation"]},
    {"name": "ChildrenInstantiation", "symbols": ["ModuleInstantiation"]},
    {"name": "ChildrenInstantiation", "symbols": [{"literal":"{"}, "ModuleInstantiationList", {"literal":"}"}]},
    {"name": "SingleModuleInstantiation", "symbols": ["Identifier", "_", {"literal":"("}, "_", "Arguments", "_", {"literal":")"}, "_"]},
    {"name": "SingleModuleInstantiation", "symbols": ["Identifier", {"literal":":"}, "__", "SingleModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"!"}, "SingleModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"#"}, "SingleModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"%"}, "SingleModuleInstantiation"]},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"*"}, "SingleModuleInstantiation"]},
    {"name": "Expression", "symbols": [tok_true], "postprocess": id},
    {"name": "Expression", "symbols": [tok_false], "postprocess": id},
    {"name": "Expression", "symbols": ["Identifier"]},
    {"name": "Expression", "symbols": ["Expression", {"literal":"."}, "Identifier"]},
    {"name": "Expression", "symbols": ["String"]},
    {"name": "Expression", "symbols": ["Float"]},
    {"name": "Expression", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}]},
    {"name": "Expression", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":":"}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "Expression", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":":"}, "_", "Expression", "_", {"literal":":"}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "Expression", "symbols": [{"literal":"["}, "_", "VectorExpression", "_", {"literal":"]"}]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"*"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"/"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"%"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"+"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"-"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"<"}, "_", "Expression"]},
    {"name": "Expression$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$1", "_", "Expression"]},
    {"name": "Expression$string$2", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$2", "_", "Expression"]},
    {"name": "Expression$string$3", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$3", "_", "Expression"]},
    {"name": "Expression$string$4", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$4", "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":">"}, "_", "Expression"]},
    {"name": "Expression$string$5", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$5", "_", "Expression"]},
    {"name": "Expression$string$6", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$6", "_", "Expression"]},
    {"name": "Expression", "symbols": [{"literal":"+"}, "_", "Expression"]},
    {"name": "Expression", "symbols": [{"literal":"-"}, "_", "Expression"]},
    {"name": "Expression", "symbols": [{"literal":"!"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"?"}, "_", "Expression", "_", {"literal":":"}, "_", "Expression"]},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "Expression", "symbols": ["Identifier", "_", {"literal":"("}, "_", "Arguments", "_", {"literal":")"}]},
    {"name": "String$ebnf$1", "symbols": []},
    {"name": "String$ebnf$1", "symbols": ["String$ebnf$1", /[^"\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "String", "symbols": [{"literal":"\""}, "String$ebnf$1", {"literal":"\""}]},
    {"name": "Float", "symbols": ["Integer"]},
    {"name": "Float", "symbols": ["Integer", {"literal":"."}, "Integer"], "postprocess": d => d[0] + d[1] + d[2]},
    {"name": "Integer", "symbols": [/[0-9]/], "postprocess": d => d[0]},
    {"name": "Integer", "symbols": ["Integer", /[0-9]/], "postprocess": d => d[0] + d[1]},
    {"name": "VectorExpression", "symbols": ["Expression"]},
    {"name": "VectorExpression", "symbols": ["VectorExpression", "_", {"literal":","}, "_", "Expression"]},
    {"name": "Parameters", "symbols": []},
    {"name": "Parameters", "symbols": ["Parameter"]},
    {"name": "Parameters", "symbols": ["Parameters", "_", {"literal":","}, "_", "Parameter"]},
    {"name": "Parameter", "symbols": ["Identifier"]},
    {"name": "Parameter", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression"]},
    {"name": "Arguments", "symbols": []},
    {"name": "Arguments", "symbols": ["Argument"]},
    {"name": "Arguments", "symbols": ["Arguments", "_", {"literal":","}, "_", "Argument"]},
    {"name": "Argument", "symbols": ["Expression"]},
    {"name": "Argument", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression"]},
    {"name": "Path$ebnf$1", "symbols": [/[^>]/]},
    {"name": "Path$ebnf$1", "symbols": ["Path$ebnf$1", /[^>]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Path", "symbols": ["Path$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "Identifier", "symbols": [/[A-Za-z_$]/], "postprocess": d => d[0]},
    {"name": "Identifier", "symbols": ["Identifier", /[A-Za-z0-9_]/], "postprocess": d => d[0] + d[1]}
]
  , ParserStart: "RootNode"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
