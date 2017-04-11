@{% 
    require('../ast');
%}
 
@include "./misc.ne"
@include "./values.ne"

RootNode -> (StatementNode):* {% d => new RootNode(_.flattenDeep(d)) %}

StatementNode ->
	VariableNode _  ";" _  {% d => d[0] %}
	| Comment _  {% d => d[0] %}

VariableNode -> Name _  "=" _ ValueNode {% d => new VariableNode(d[0], d[4]) %}
	
Name ->
	[A-Za-z_$] {% d => d[0] %}
	| Name [A-Za-z0-9_] {% d => d[0] + d[1] %}
 
Comment ->
	"//" [^\n]:+ {% d => new CommentNode(d[1].join('').trim()) %}
	| "/*" [^*/]:+ "*/" {% d => new CommentNode(d[1].join(''), true) %}