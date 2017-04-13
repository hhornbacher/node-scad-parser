@{% 
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
%}
 
@builtin "whitespace.ne"
#@include "./misc.ne"
#@include "./values.ne"  

RootNode -> Body {% id %}

Body ->
	null
	| Statement Body

Statement ->
	";"
	| "{" Body "}"
	| Identifier _ "=" _ Expression _ ";"
	| %tok_module __ Identifier _ "(" _ Parameters _ ")" _ Statement __
	| %tok_function __ Identifier _ "(" _ Parameters _ ")" _ "=" _ Expression __

Expression ->
	%tok_true {% id %}
	| %tok_false {% id %}

Parameters ->
	null
	| Parameter
	| Parameters _ "," _ Parameter

Parameter ->
	Identifier
	| Identifier _ "=" _ Expression

Arguments ->
	null
	| Argument
	| Arguments _ "," _ Argument

Argument ->
	Expression
	| Identifier _ "=" _ Expression

Identifier ->
	[A-Za-z_$] {% d => d[0] %}
	| Identifier [A-Za-z0-9_] {% d => d[0] + d[1] %}

#BlockNode -> "{" _ (StatementNode):* _ "}" {% d => new BlockNode(_.flattenDeep(d[2])) %}

#StatementNode ->
#	VariableNode EndOfStatement  {% d => d[0] %}
#	| IncludeNode EndOfStatement {% d => d[0] %}
#	| Comment _  {% d => d[0] %}

#VariableNode -> 
#	Name _  "=" _ TermNode {% d => new VariableNode(d[0], d[4]) %}
#	| Name _  "=" _ ValueNode {% d => new VariableNode(d[0], d[4]) %}

#IncludeNode ->
#	%tok_include _ "<" Path ">"  {% d => new IncludeNode(d[1]) %}
#	| %tok_use _ "<" Path ">"  {% d => new UseNode(d[1]) %}

#TermNode -> 
#	"(" _ TermNode _ ")"  {% d => d[2] %}
#	| ValueNode Operator ValueNode {% d => new TermNode([d[0],d[2]], d[1]) %}
#	| TermNode Operator TermNode {% d => new TermNode([d[0],d[2]], d[1]) %}

#Expression ->
#	"true"
#	| "false"
#	| "undef"

#Operator -> _ [-+*/] _   {% d => d[1] %}

#Path ->
#	[^>]:+ {% d => d[0].join('') %}

