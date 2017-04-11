@{% 
    require('../ast');
%}

RootNode -> (StatementNode):* {% d => new RootNode(_.flattenDeep(d)) %}

StatementNode ->
	Variable WhiteSpace:?  ";" WhiteSpace:?  {% d => d[0] %}
	| Comment WhiteSpace:?  {% d => d[0] %}

Variable -> Name WhiteSpace:?  "=" WhiteSpace:? ValueNode {% d => new VariableNode(d[0], d[4]) %}

ValueNode ->
	NumberValue  {% d => d[0] %}
    | ReferenceValue {% d => d[0] %}
    | StringValue {% d => d[0] %}
	| VectorValue {% d => d[0] %}

StringValue ->
    "\"" [^"]:+ "\"" {% d => new StringValue(_.flattenDeep(d[1]).join('')) %}

ReferenceValue -> 
    Name {% d => new ReferenceValue(d[0], false) %}
    | "-" WhiteSpace:? Name {% d => new ReferenceValue(d[2], true) %}

VectorValue ->
	"[" WhiteSpace:? VectorList WhiteSpace:? "]"  {% d => new VectorValue(d[2], false) %}
    | "-" WhiteSpace:? "[" WhiteSpace:? VectorList WhiteSpace:? "]" {% d => new VectorValue(d[4], true) %}

VectorList ->
	ValueNode {% d => d[0] %}
	| VectorList WhiteSpace:? "," WhiteSpace:? ValueNode {% d => _.flattenDeep([d[0], d[4]]) %}

NumberValue ->
	Float {% d => new NumberValue(parseFloat(d[0]), false) %}
	| Integer {% d => new NumberValue(parseFloat(d[0]), false) %}
	| "-" WhiteSpace:? Float {% d => new NumberValue(parseFloat(d[2]), true) %}
	| "-" WhiteSpace:? Integer {% d => new NumberValue(parseFloat(d[2]), true) %}

Float ->
	Integer "." Integer {% d => d[0] + d[1] + d[2] %}

Integer ->
	[0-9] {% d => d[0] %}
	| Integer [0-9] {% d => d[0] + d[1] %}

	
Name ->
	[A-Za-z_$] {% d => d[0] %}
	| Name [A-Za-z0-9_] {% d => d[0] + d[1] %}

Comment ->
	"//" [^\n]:+ {% d => new CommentNode(d[1].join('').trim()) %}
	| "/*" [^*/]:+ "*/" {% d => new CommentNode(d[1].join(''), true) %}

WhiteSpace ->
	[\r\n ]:+ {% d => null %}