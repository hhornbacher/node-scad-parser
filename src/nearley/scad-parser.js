// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 
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
    {"name": "Block", "symbols": []},
    {"name": "Block", "symbols": ["Statement", "Block"], "postprocess": d => _.concat([d[0]], d[1])},
    {"name": "Statement$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement$ebnf$1", "symbols": []},
    {"name": "Statement$ebnf$1", "symbols": ["Statement$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Statement", "symbols": ["Statement$string$1", "Statement$ebnf$1", {"literal":"\n"}, "_"], "postprocess": d => new CommentNode(d[1].join(''))},
    {"name": "Statement$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"c"}, {"literal":"l"}, {"literal":"u"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement", "symbols": ["Statement$string$2", "_", {"literal":"<"}, "Path", {"literal":">"}, "_", {"literal":";"}, "_"], "postprocess": d => new IncludeNode(d[3])},
    {"name": "Statement$string$3", "symbols": [{"literal":"u"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement", "symbols": ["Statement$string$3", "_", {"literal":"<"}, "Path", {"literal":">"}, "_", {"literal":";"}, "_"], "postprocess": d => new UseNode(d[3])},
    {"name": "Statement", "symbols": ["ModuleInstantiation", "_"], "postprocess": id},
    {"name": "Statement", "symbols": [{"literal":"{"}, "_", "Block", "_", {"literal":"}"}, "_"], "postprocess": d => d[2]},
    {"name": "Statement", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression", "_", {"literal":";"}, "_"], "postprocess": d => new VariableNode(d[0], d[4])},
    {"name": "Statement$string$4", "symbols": [{"literal":"m"}, {"literal":"o"}, {"literal":"d"}, {"literal":"u"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement", "symbols": ["Statement$string$4", "__", "Identifier", "_", {"literal":"("}, "_", "Parameters", "_", {"literal":")"}, "_", "Statement", "_"], "postprocess": d => new ModuleNode(d[2], d[6], d[10])},
    {"name": "Statement$string$5", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Statement", "symbols": ["Statement$string$5", "__", "Identifier", "_", {"literal":"("}, "_", "Parameters", "_", {"literal":")"}, "_", {"literal":"="}, "_", "Expression", "_", {"literal":";"}, "_"], "postprocess": d => new FunctionNode(d[2], d[6], d[12])},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "_", {"literal":";"}], "postprocess": id},
    {"name": "ModuleInstantiation", "symbols": ["SingleModuleInstantiation", "ChildrenInstantiation"], "postprocess": d => d[0].setChildren(d[1])},
    {"name": "ChildrenInstantiation", "symbols": ["ModuleInstantiation"]},
    {"name": "ChildrenInstantiation", "symbols": [{"literal":"{"}, "_", "ModuleInstantiationList", "_", {"literal":"}"}], "postprocess": d => d[2]},
    {"name": "ModuleInstantiationList", "symbols": []},
    {"name": "ModuleInstantiationList", "symbols": ["ModuleInstantiationList", "ModuleInstantiation"], "postprocess": d => _.flattenDeep(d)},
    {"name": "ModuleInstantiationList", "symbols": ["ModuleInstantiationList", "Statement"], "postprocess": d => _.flattenDeep(d)},
    {"name": "SingleModuleInstantiation", "symbols": ["Identifier", "_", {"literal":"("}, "_", "Arguments", "_", {"literal":")"}, "_"], "postprocess": d => new ActionNode(d[0], d[4])},
    {"name": "SingleModuleInstantiation", "symbols": ["Identifier", {"literal":":"}, "__", "SingleModuleInstantiation"], "postprocess": d => d[3].setLabel(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"!"}, "SingleModuleInstantiation"], "postprocess": d => d[1].setModifier(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"#"}, "SingleModuleInstantiation"], "postprocess": d => d[1].setModifier(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"%"}, "SingleModuleInstantiation"], "postprocess": d => d[1].setModifier(d[0])},
    {"name": "SingleModuleInstantiation", "symbols": [{"literal":"*"}, "SingleModuleInstantiation"], "postprocess": d => d[1].setModifier(d[0])},
    {"name": "Expression$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression$string$1"], "postprocess": () => new BooleanValue(true)},
    {"name": "Expression$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression$string$2"], "postprocess": () => new BooleanValue(false)},
    {"name": "Expression", "symbols": ["Identifier"], "postprocess": d => new ReferenceValue(d[0])},
    {"name": "Expression", "symbols": ["Expression", {"literal":"."}, "Identifier"]},
    {"name": "Expression", "symbols": ["String"], "postprocess": d => new StringValue(d[0])},
    {"name": "Expression", "symbols": ["Float"], "postprocess": d => new NumberValue(d[0])},
    {"name": "Expression", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}], "postprocess": d => new ExpressionNode(d[2])},
    {"name": "Expression", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":":"}, "_", "Expression", "_", {"literal":"]"}], "postprocess": d => new RangeValue(d[2], d[6])},
    {"name": "Expression", "symbols": [{"literal":"["}, "_", "Expression", "_", {"literal":":"}, "_", "Expression", "_", {"literal":":"}, "_", "Expression", "_", {"literal":"]"}], "postprocess": d => new RangeValue(d[2], d[10], d[6])},
    {"name": "Expression", "symbols": [{"literal":"["}, "_", "VectorExpression", "_", {"literal":"]"}], "postprocess": d => new VectorValue(d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"*"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"/"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"%"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"+"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"-"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":"<"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression$string$3", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$3", "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression$string$4", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$4", "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression$string$5", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$5", "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression$string$6", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$6", "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": ["Expression", "_", {"literal":">"}, "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression$string$7", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$7", "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression$string$8", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Expression", "symbols": ["Expression", "_", "Expression$string$8", "_", "Expression"], "postprocess": d => new ExpressionNode(d[0], d[4], d[2])},
    {"name": "Expression", "symbols": [{"literal":"+"}, "_", "Expression"], "postprocess": d => d[2]},
    {"name": "Expression", "symbols": [{"literal":"-"}, "_", "Expression"], "postprocess":  d => {
        	if(_.isNumber(d[2]))
        		return -d[2];
        	else
        		return d[2].setNegative(true);
        } },
    {"name": "Expression", "symbols": [{"literal":"!"}, "_", "Expression"], "postprocess": d => !d[2]},
    {"name": "String$ebnf$1", "symbols": []},
    {"name": "String$ebnf$1", "symbols": ["String$ebnf$1", /[^"\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "String", "symbols": [{"literal":"\""}, "String$ebnf$1", {"literal":"\""}], "postprocess": d => d[1].join('')},
    {"name": "Float", "symbols": ["Integer"], "postprocess": d => d[0]},
    {"name": "Float", "symbols": ["Integer", {"literal":"."}, "Integer"], "postprocess": d => d[0] + d[1] + d[2]},
    {"name": "Integer", "symbols": [/[0-9]/], "postprocess": d => d[0]},
    {"name": "Integer", "symbols": ["Integer", /[0-9]/], "postprocess": d => d[0] + d[1]},
    {"name": "VectorExpression", "symbols": ["Expression"], "postprocess": d => d[0]},
    {"name": "VectorExpression", "symbols": ["VectorExpression", "_", {"literal":","}, "_", "Expression"], "postprocess": d => _.concat(d[0], [d[4]])},
    {"name": "Parameters", "symbols": []},
    {"name": "Parameters", "symbols": ["Parameter"]},
    {"name": "Parameters", "symbols": ["Parameters", "_", {"literal":","}, "_", "Parameter"], "postprocess": d => _.concat(d[0], [d[4]])},
    {"name": "Parameter", "symbols": ["Identifier"], "postprocess": id},
    {"name": "Parameter", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression"], "postprocess": d => ([d[0], d[4]])},
    {"name": "Arguments", "symbols": []},
    {"name": "Arguments", "symbols": ["Argument"]},
    {"name": "Arguments", "symbols": ["Arguments", "_", {"literal":","}, "_", "Argument"], "postprocess": d => _.concat(d[0], [d[4]])},
    {"name": "Argument", "symbols": ["Expression"], "postprocess": id},
    {"name": "Argument", "symbols": ["Identifier", "_", {"literal":"="}, "_", "Expression"], "postprocess": d => ([d[0], d[4]])},
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
