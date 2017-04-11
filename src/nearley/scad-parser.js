// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
    require('../ast');
var grammar = {
    ParserRules: [
    {"name": "EndOfStatement", "symbols": ["_", {"literal":";"}, "_"]},
    {"name": "_$ebnf$1", "symbols": ["WhiteSpace"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__", "symbols": ["WhiteSpace"]},
    {"name": "WhiteSpace$ebnf$1", "symbols": [/[\r\n ]/]},
    {"name": "WhiteSpace$ebnf$1", "symbols": ["WhiteSpace$ebnf$1", /[\r\n ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "WhiteSpace", "symbols": ["WhiteSpace$ebnf$1"], "postprocess": d => null},
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
    {"name": "ReferenceValue", "symbols": [{"literal":"-"}, "_", "Name"], "postprocess": d => new ReferenceValue(d[2], true)},
    {"name": "RangeValue", "symbols": [{"literal":"["}, "_", "ValueNode", "_", {"literal":":"}, "_", "ValueNode", "_", {"literal":"]"}], "postprocess": d => new RangeValue(d[2], d[6])},
    {"name": "RangeValue", "symbols": [{"literal":"["}, "_", "ValueNode", "_", {"literal":":"}, "_", "ValueNode", "_", {"literal":":"}, "_", "ValueNode", "_", {"literal":"]"}], "postprocess": d => new RangeValue(d[2], d[10], d[6])},
    {"name": "VectorValue", "symbols": [{"literal":"["}, "_", "VectorList", "_", {"literal":"]"}], "postprocess": d => new VectorValue(d[2], false)},
    {"name": "VectorValue", "symbols": [{"literal":"-"}, "_", {"literal":"["}, "_", "VectorList", "_", {"literal":"]"}], "postprocess": d => new VectorValue(d[4], true)},
    {"name": "VectorList", "symbols": ["ValueNode"], "postprocess": d => d[0]},
    {"name": "VectorList", "symbols": ["VectorList", "_", {"literal":","}, "_", "ValueNode"], "postprocess": d => _.flattenDeep([d[0], d[4]])},
    {"name": "NumberValue", "symbols": ["Float"], "postprocess": d => new NumberValue(parseFloat(d[0]), false)},
    {"name": "NumberValue", "symbols": ["Integer"], "postprocess": d => new NumberValue(parseFloat(d[0]), false)},
    {"name": "NumberValue", "symbols": [{"literal":"-"}, "_", "Float"], "postprocess": d => new NumberValue(parseFloat(d[2]), true)},
    {"name": "NumberValue", "symbols": [{"literal":"-"}, "_", "Integer"], "postprocess": d => new NumberValue(parseFloat(d[2]), true)},
    {"name": "Float", "symbols": ["Integer", {"literal":"."}, "Integer"], "postprocess": d => d[0] + d[1] + d[2]},
    {"name": "Integer", "symbols": [/[0-9]/], "postprocess": d => d[0]},
    {"name": "Integer", "symbols": ["Integer", /[0-9]/], "postprocess": d => d[0] + d[1]},
    {"name": "RootNode$ebnf$1", "symbols": []},
    {"name": "RootNode$ebnf$1$subexpression$1", "symbols": ["StatementNode"]},
    {"name": "RootNode$ebnf$1", "symbols": ["RootNode$ebnf$1", "RootNode$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "RootNode", "symbols": ["RootNode$ebnf$1"], "postprocess": d => new RootNode(_.flattenDeep(d))},
    {"name": "BlockNode$ebnf$1", "symbols": []},
    {"name": "BlockNode$ebnf$1$subexpression$1", "symbols": ["StatementNode"]},
    {"name": "BlockNode$ebnf$1", "symbols": ["BlockNode$ebnf$1", "BlockNode$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "BlockNode", "symbols": [{"literal":"{"}, "_", "BlockNode$ebnf$1", "_", {"literal":"}"}], "postprocess": d => new BlockNode(_.flattenDeep(d[2]))},
    {"name": "StatementNode", "symbols": ["VariableNode", "EndOfStatement"], "postprocess": d => d[0]},
    {"name": "StatementNode", "symbols": ["IncludeNode", "EndOfStatement"], "postprocess": d => d[0]},
    {"name": "StatementNode", "symbols": ["Comment", "_"], "postprocess": d => d[0]},
    {"name": "VariableNode", "symbols": ["Name", "_", {"literal":"="}, "_", "TermNode"], "postprocess": d => new VariableNode(d[0], d[4])},
    {"name": "IncludeNode$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"c"}, {"literal":"l"}, {"literal":"u"}, {"literal":"d"}, {"literal":"e"}, {"literal":" "}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IncludeNode", "symbols": ["IncludeNode$string$1", "Path", {"literal":">"}], "postprocess": d => new IncludeNode(d[1])},
    {"name": "IncludeNode$string$2", "symbols": [{"literal":"u"}, {"literal":"s"}, {"literal":"e"}, {"literal":" "}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "IncludeNode", "symbols": ["IncludeNode$string$2", "Path", {"literal":">"}], "postprocess": d => new UseNode(d[1])},
    {"name": "TermNode", "symbols": ["ValueNode"], "postprocess": d => d[0]},
    {"name": "TermNode", "symbols": ["Term"]},
    {"name": "TermNode", "symbols": ["Term", "Add", "Term"]},
    {"name": "TermNode", "symbols": ["Term", "Subtract", "Term"]},
    {"name": "TermNode", "symbols": ["Term", "Multiply", "Term"]},
    {"name": "TermNode", "symbols": ["Term", "Divide", "Term"]},
    {"name": "TermNode", "symbols": [{"literal":"("}, "_", "Term", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "Term", "symbols": ["ValueNode", "Add", "ValueNode"]},
    {"name": "Term", "symbols": ["ValueNode", "Subtract", "ValueNode"]},
    {"name": "Term", "symbols": ["ValueNode", "Multiply", "ValueNode"]},
    {"name": "Term", "symbols": ["ValueNode", "Divide", "ValueNode"]},
    {"name": "Add", "symbols": ["_", {"literal":"+"}, "_"]},
    {"name": "Subtract", "symbols": ["_", {"literal":"-"}, "_"]},
    {"name": "Multiply", "symbols": ["_", {"literal":"*"}, "_"]},
    {"name": "Divide", "symbols": ["_", {"literal":"/"}, "_"]},
    {"name": "Path$ebnf$1", "symbols": [/[^>]/]},
    {"name": "Path$ebnf$1", "symbols": ["Path$ebnf$1", /[^>]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Path", "symbols": ["Path$ebnf$1"], "postprocess": d => d[0].join('')},
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
    {"name": "Comment", "symbols": ["Comment$string$2", "Comment$ebnf$2", "Comment$string$3"], "postprocess": d => new CommentNode(d[1].join(''), true)}
]
  , ParserStart: "RootNode"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
