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
    {"name": "RootNode", "symbols": ["Body"], "postprocess": id},
    {"name": "Body", "symbols": []},
    {"name": "Body", "symbols": ["Statement", "Body"]},
    {"name": "Statement", "symbols": [{"literal":";"}]},
    {"name": "Statement", "symbols": [{"literal":"{"}, "Body", {"literal":"}"}]},
    {"name": "Statement", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression", "_", {"literal":";"}]},
    {"name": "Statement", "symbols": [tok_module, "__", "Identifier", "_", {"literal":"("}, "_", "Parameters", "_", {"literal":")"}, "_", "Statement", "__"]},
    {"name": "Statement", "symbols": [tok_function, "__", "Identifier", "_", {"literal":"("}, "_", "Parameters", "_", {"literal":")"}, "_", {"literal":"="}, "_", "Expression", "__"]},
    {"name": "Expression", "symbols": [tok_true], "postprocess": id},
    {"name": "Expression", "symbols": [tok_false], "postprocess": id},
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
