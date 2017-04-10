// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
    require('../ast');
var grammar = {
    ParserRules: [
    {"name": "RootNode$subexpression$1$ebnf$1", "symbols": []},
    {"name": "RootNode$subexpression$1$ebnf$1", "symbols": ["RootNode$subexpression$1$ebnf$1", "StatementNode"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "RootNode$subexpression$1", "symbols": ["RootNode$subexpression$1$ebnf$1"]},
    {"name": "RootNode", "symbols": ["RootNode$subexpression$1"], "postprocess": d => _.flattenDeep(d)},
    {"name": "StatementNode$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "StatementNode$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "StatementNode$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "StatementNode$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "StatementNode", "symbols": ["Variable", "StatementNode$ebnf$1", {"literal":";"}, "StatementNode$ebnf$2"], "postprocess": d => d[0]},
    {"name": "Variable$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "Variable$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Variable$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "Variable$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Variable", "symbols": ["Name", "Variable$ebnf$1", {"literal":"="}, "Variable$ebnf$2", "Value"], "postprocess": d => ({name:d[0], value:d[4]})},
    {"name": "Value", "symbols": ["Number"], "postprocess":  d => {
            let val = parseFloat(d[0]);
            let negative = val<0;
            if(negative)
                val*=-1;
            return new NumberValue(val, negative);
        } },
    {"name": "Value", "symbols": ["Reference"], "postprocess": d => d[0]},
    {"name": "Reference", "symbols": ["Name"], "postprocess": d => new ReferenceValue(d[0], false)},
    {"name": "Reference", "symbols": [{"literal":"-"}, "Name"], "postprocess": d => new ReferenceValue(d[0], true)},
    {"name": "Name", "symbols": [/[A-Za-z_$]/], "postprocess": d => d[0]},
    {"name": "Name", "symbols": ["Name", /[A-Za-z0-9_]/], "postprocess": d => d[0] + d[1]},
    {"name": "Number", "symbols": ["Float"], "postprocess": d => d[0]},
    {"name": "Number", "symbols": ["Integer"], "postprocess": d => d[0]},
    {"name": "Number$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "Number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Number", "symbols": [{"literal":"-"}, "Number$ebnf$1", "Float"], "postprocess": d => d[0] + d[2]},
    {"name": "Number$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "Number$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Number", "symbols": [{"literal":"-"}, "Number$ebnf$2", "Integer"], "postprocess": d => d[0] + d[2]},
    {"name": "Float", "symbols": ["Integer", {"literal":"."}, "Integer"], "postprocess": d => d[0] + d[1] + d[2]},
    {"name": "Integer", "symbols": [/[0-9]/], "postprocess": d => d[0]},
    {"name": "Integer", "symbols": ["Integer", /[0-9]/], "postprocess": d => d[0] + d[1]},
    {"name": "WhiteSpace$ebnf$1", "symbols": [/[\r\n\r ]/]},
    {"name": "WhiteSpace$ebnf$1", "symbols": ["WhiteSpace$ebnf$1", /[\r\n\r ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "WhiteSpace", "symbols": ["WhiteSpace$ebnf$1"], "postprocess": d => null}
]
  , ParserStart: "RootNode"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
