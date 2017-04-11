@{% 
    require('../ast');
%}
 
@include "./misc.ne"
@include "./values.ne"

RootNode -> (StatementNode):* {% d => new RootNode(_.flattenDeep(d)) %}

BlockNode -> "{" _ (StatementNode):* _ "}" {% d => new BlockNode(_.flattenDeep(d[2])) %}

StatementNode ->
	VariableNode EndOfStatement  {% d => d[0] %}
	| IncludeNode EndOfStatement {% d => d[0] %}
	| Comment _  {% d => d[0] %}

VariableNode -> Name _  "=" _ TermNode {% d => new VariableNode(d[0], d[4]) %}

IncludeNode ->
	"include <" Path ">"  {% d => new IncludeNode(d[1]) %}
	| "use <" Path ">"  {% d => new UseNode(d[1]) %}

TermNode -> 
	ValueNode {% d => d[0] %}
	| Term
	| Term Add Term 
	| Term Subtract Term
	| Term Multiply Term
	| Term Divide Term
	| "(" _ Term _ ")"  {% d => d[2] %}

Term ->
	ValueNode Add ValueNode
	| ValueNode Subtract ValueNode
	| ValueNode Multiply ValueNode
	| ValueNode Divide ValueNode

Add -> _ "+" _
Subtract -> _ "-" _
Multiply -> _ "*" _
Divide -> _ "/" _

Path ->
	[^>]:+ {% d => d[0].join('') %}
	
Name ->
	[A-Za-z_$] {% d => d[0] %}
	| Name [A-Za-z0-9_] {% d => d[0] + d[1] %}
 
Comment ->
	"//" [^\n]:+ {% d => new CommentNode(d[1].join('').trim()) %}
	| "/*" [^*/]:+ "*/" {% d => new CommentNode(d[1].join(''), true) %}