// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
    require('../ast');
var grammar = {
    ParserRules: [
    {"name": "RootNode$ebnf$1", "symbols": []},
    {"name": "RootNode$ebnf$1$subexpression$1", "symbols": ["StatementNode"]},
    {"name": "RootNode$ebnf$1", "symbols": ["RootNode$ebnf$1", "RootNode$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "RootNode", "symbols": ["RootNode$ebnf$1"], "postprocess": d => new RootNode(_.flattenDeep(d))},
    {"name": "StatementNode$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "StatementNode$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "StatementNode$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "StatementNode$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "StatementNode", "symbols": ["Variable", "StatementNode$ebnf$1", {"literal":";"}, "StatementNode$ebnf$2"], "postprocess": d => d[0]},
    {"name": "StatementNode$ebnf$3", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "StatementNode$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "StatementNode", "symbols": ["Comment", "StatementNode$ebnf$3"], "postprocess": d => d[0]},
    {"name": "Variable$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "Variable$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Variable$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "Variable$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Variable", "symbols": ["Name", "Variable$ebnf$1", {"literal":"="}, "Variable$ebnf$2", "ValueNode"], "postprocess": d => new VariableNode(d[0], d[4])},
    {"name": "ValueNode", "symbols": ["NumberValue"], "postprocess": d => d[0]},
    {"name": "ValueNode", "symbols": ["VectorValue"], "postprocess": d => d[0]},
    {"name": "ValueNode", "symbols": ["RangeValue"], "postprocess": d => d[0]},
    {"name": "ValueNode", "symbols": ["StringValue"], "postprocess": d => d[0]},
    {"name": "ValueNode", "symbols": ["ReferenceValue"], "postprocess": d => d[0]},
    {"name": "StringValue$ebnf$1", "symbols": [/[^"]/]},
    {"name": "StringValue$ebnf$1", "symbols": ["StringValue$ebnf$1", /[^"]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringValue", "symbols": [{"literal":"\""}, "StringValue$ebnf$1", {"literal":"\""}], "postprocess": d => new StringValue(_.flattenDeep(d[1]).join(''))},
    {"name": "ReferenceValue", "symbols": ["Name"], "postprocess":  d => {
        	if(d[0] === 'true')
        		return new BooleanValue(true);
        	else if(d[0] === 'false')
        		return new BooleanValue(false);
        	else
        		return new ReferenceValue(d[0], false);
        } },
    {"name": "ReferenceValue$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "ReferenceValue$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ReferenceValue", "symbols": [{"literal":"-"}, "ReferenceValue$ebnf$1", "Name"], "postprocess": d => new ReferenceValue(d[2], true)},
    {"name": "RangeValue$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$3", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$4", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue", "symbols": [{"literal":"["}, "RangeValue$ebnf$1", "ValueNode", "RangeValue$ebnf$2", {"literal":":"}, "RangeValue$ebnf$3", "ValueNode", "RangeValue$ebnf$4", {"literal":"]"}], "postprocess": d => new RangeValue(d[2], d[6])},
    {"name": "RangeValue$ebnf$5", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$6", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$7", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$7", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$8", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$8", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$9", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$9", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue$ebnf$10", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "RangeValue$ebnf$10", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RangeValue", "symbols": [{"literal":"["}, "RangeValue$ebnf$5", "ValueNode", "RangeValue$ebnf$6", {"literal":":"}, "RangeValue$ebnf$7", "ValueNode", "RangeValue$ebnf$8", {"literal":":"}, "RangeValue$ebnf$9", "ValueNode", "RangeValue$ebnf$10", {"literal":"]"}], "postprocess": d => new RangeValue(d[2], d[10], d[6])},
    {"name": "VectorValue$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorValue$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorValue$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorValue$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorValue", "symbols": [{"literal":"["}, "VectorValue$ebnf$1", "VectorList", "VectorValue$ebnf$2", {"literal":"]"}], "postprocess": d => new VectorValue(d[2], false)},
    {"name": "VectorValue$ebnf$3", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorValue$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorValue$ebnf$4", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorValue$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorValue$ebnf$5", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorValue$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorValue", "symbols": [{"literal":"-"}, "VectorValue$ebnf$3", {"literal":"["}, "VectorValue$ebnf$4", "VectorList", "VectorValue$ebnf$5", {"literal":"]"}], "postprocess": d => new VectorValue(d[4], true)},
    {"name": "VectorList", "symbols": ["ValueNode"], "postprocess": d => d[0]},
    {"name": "VectorList$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorList$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorList$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "VectorList$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "VectorList", "symbols": ["VectorList", "VectorList$ebnf$1", {"literal":","}, "VectorList$ebnf$2", "ValueNode"], "postprocess": d => _.flattenDeep([d[0], d[4]])},
    {"name": "NumberValue", "symbols": ["Float"], "postprocess": d => new NumberValue(parseFloat(d[0]), false)},
    {"name": "NumberValue", "symbols": ["Integer"], "postprocess": d => new NumberValue(parseFloat(d[0]), false)},
    {"name": "NumberValue$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "NumberValue$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "NumberValue", "symbols": [{"literal":"-"}, "NumberValue$ebnf$1", "Float"], "postprocess": d => new NumberValue(parseFloat(d[2]), true)},
    {"name": "NumberValue$ebnf$2", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "NumberValue$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "NumberValue", "symbols": [{"literal":"-"}, "NumberValue$ebnf$2", "Integer"], "postprocess": d => new NumberValue(parseFloat(d[2]), true)},
    {"name": "Float", "symbols": ["Integer", {"literal":"."}, "Integer"], "postprocess": d => d[0] + d[1] + d[2]},
    {"name": "Integer", "symbols": [/[0-9]/], "postprocess": d => d[0]},
    {"name": "Integer", "symbols": ["Integer", /[0-9]/], "postprocess": d => d[0] + d[1]},
    {"name": "Name", "symbols": [/[A-Za-z_$]/], "postprocess": d => d[0]},
    {"name": "Name", "symbols": ["Name", /[A-Za-z0-9_]/], "postprocess": d => d[0] + d[1]},
    {"name": "Comment$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Comment$ebnf$1", "symbols": [/[^\n]/]},
    {"name": "Comment$ebnf$1", "symbols": ["Comment$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Comment", "symbols": ["Comment$string$1", "Comment$ebnf$1"], "postprocess": d => new CommentNode(d[1].join('').trim())},
    {"name": "Comment$string$2", "symbols": [{"literal":"/"}, {"literal":"*"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Comment$ebnf$2", "symbols": [/[^*\/]/]},
    {"name": "Comment$ebnf$2", "symbols": ["Comment$ebnf$2", /[^*\/]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Comment$string$3", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Comment", "symbols": ["Comment$string$2", "Comment$ebnf$2", "Comment$string$3"], "postprocess": d => new CommentNode(d[1].join(''), true)},
    {"name": "WhiteSpace$ebnf$1", "symbols": [/[\r\n ]/]},
    {"name": "WhiteSpace$ebnf$1", "symbols": ["WhiteSpace$ebnf$1", /[\r\n ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
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
