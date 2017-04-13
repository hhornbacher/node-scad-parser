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

RootNode -> 
	Block

Block ->
	null
	| Statement Block

Statement ->
	";"
	| "//" [^\n]:* "\n"
#	| %tok_include _ "<" Path ">" _ ";"
#	| %tok_use _ "<" Path ">" _ ";"
	| ModuleInstantiation
	| "{" Block "}"
	| Identifier _ "=" _ Expression _ ";" _
	| %tok_module __ Identifier _ "(" _ Parameters _ ")" _ Statement __
	| %tok_function __ Identifier _ "(" _ Parameters _ ")" _ "=" _ Expression __


ModuleInstantiation ->
	SingleModuleInstantiation _ ";"
	| SingleModuleInstantiation ChildrenInstantiation

ModuleInstantiationList ->
	null
	| ModuleInstantiationList ModuleInstantiation

ChildrenInstantiation ->
	ModuleInstantiation
	| "{" ModuleInstantiationList "}"

SingleModuleInstantiation ->
	Identifier _ "(" _ Arguments _ ")" _
	| Identifier ":" __ SingleModuleInstantiation
	| "!" SingleModuleInstantiation
	| "#" SingleModuleInstantiation
	| "%" SingleModuleInstantiation
	| "*" SingleModuleInstantiation

Expression ->
	%tok_true {% id %}
	| %tok_false {% id %}
	| Identifier
	| Expression "." Identifier
	| String
	| Float
	| "(" _ Expression _ ")"
	| "[" _ Expression _ ":" _ Expression _ "]"
	| "[" _ Expression _ ":" _ Expression _ ":" _ Expression _ "]"
	| "[" _ VectorExpression _ "]"
	| Expression _ "*" _ Expression
	| Expression _ "/" _ Expression
	| Expression _ "%" _ Expression
	| Expression _ "+" _ Expression
	| Expression _ "-" _ Expression
	| Expression _ "<" _ Expression
	| Expression _ "<=" _ Expression
	| Expression _ "==" _ Expression
	| Expression _ "!=" _ Expression
	| Expression _ ">=" _ Expression
	| Expression _ ">" _ Expression
	| Expression _ "&&" _ Expression
	| Expression _ "||" _ Expression
	| "+" _ Expression
	| "-" _ Expression
	| "!" _ Expression
	| Expression _ "?" _ Expression _ ":" _ Expression
	| Expression _ "[" _ Expression _ "]"
	| Identifier _ "(" _ Arguments _ ")"


String ->
	"\"" [^"\n]:* "\""

Float ->
	Integer
	| Integer "." Integer {% d => d[0] + d[1] + d[2] %}

Integer ->
	[0-9] {% d => d[0] %}
	| Integer [0-9] {% d => d[0] + d[1] %}

VectorExpression ->
	Expression
	| VectorExpression _ "," _ Expression

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

Path ->
	[^>]:+  {% d => d[0].join('') %}

Identifier ->
	[A-Za-z_$] {% d => d[0] %}
	| Identifier [A-Za-z0-9_] {% d => d[0] + d[1] %}