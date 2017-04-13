@{% 
    require('../ast');
%}
 
@builtin "whitespace.ne"

RootNode -> 
	Block {% id %}

Block ->
	null
	| Statement Block {% d => _.concat([d[0]], d[1]) %}

Statement ->
	"//" [^\n]:* "\n" _ {% d => new CommentNode(d[1].join('')) %}
	| "include" _ "<" Path ">" _ ";" _ {% d => new IncludeNode(d[3]) %}
	| "use" _ "<" Path ">" _ ";" _ {% d => new UseNode(d[3]) %}
	| ModuleInstantiation _ {% id %}
	| "{" _ Block _ "}"
	| Identifier _ "=" _ Expression _ ";" _ {% d => new VariableNode(d[0], d[4]) %}
	| "module" __ Identifier _ "(" _ Parameters _ ")" _ Statement __
	| "function" __ Identifier _ "(" _ Parameters _ ")" _ "=" _ Expression _ ";" _ {% d => new FunctionNode(d[2], d[6], d[12]) %}


ModuleInstantiation ->
	SingleModuleInstantiation _ ";"
	| SingleModuleInstantiation ChildrenInstantiation

ModuleInstantiationList ->
	null
	| ModuleInstantiationList ModuleInstantiation
	| ModuleInstantiationList Statement

ChildrenInstantiation ->
	ModuleInstantiation
	| "{" _ ModuleInstantiationList _ "}"

SingleModuleInstantiation ->
	Identifier _ "(" _ Arguments _ ")" _  {% d => new ActionNode(d[0], d[4]) %}
	| Identifier ":" __ SingleModuleInstantiation {% d => d[3].setLabel(d[0]) %}
	| "!" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}
	| "#" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}
	| "%" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}
	| "*" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}

Expression ->
	"true" {% () => true %}
	| "false" {% () => false %}
	| Identifier {% id %}
	| Expression "." Identifier
	| String {% id %}
	| Float {% id %}
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
	"\"" [^"\n]:* "\""  {% d => d[1].join('') %}

Float ->
	Integer {% d => parseFloat(d[0]) %}
	| Integer "." Integer {% d => parseFloat(d[0] + d[1] + d[2]) %}

Integer ->
	[0-9] {% d => d[0] %}
	| Integer [0-9] {% d => d[0] + d[1] %}

VectorExpression ->
	Expression {% id %}
	| VectorExpression _ "," _ Expression

Parameters ->
	null
	| Parameter
	| Parameters _ "," _ Parameter {% d => _.concat(d[0], [d[4]]) %}

Parameter ->
	Identifier {% id %}
	| Identifier _ "=" _ Expression

Arguments ->
	null
	| Argument
	| Arguments _ "," _ Argument {% d => _.concat(d[0], [d[4]]) %}

Argument ->
	Expression {% id %}
	| Identifier _ "=" _ Expression

Path ->
	[^>]:+  {% d => d[0].join('') %}

Identifier ->
	[A-Za-z_$] {% d => d[0] %}
	| Identifier [A-Za-z0-9_] {% d => d[0] + d[1] %}