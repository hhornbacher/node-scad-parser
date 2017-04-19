@{% 
    require('../ast');
%}
 
@builtin "whitespace.ne"

RootNode ->
	Block {% d => new RootNode(d[0]) %}

Block ->
	Statement
	| Block Statement {% d => _.concat(d[0], [d[1]]) %}

Statement ->
	"//" [^\n]:* "\n" _ {% d => new CommentNode(d[1].join('')) %}
	| "include" _ "<" Path ">" _ ";" _ {% d => new IncludeNode(d[3]) %}
	| "use" _ "<" Path ">" _ ";" _ {% d => new UseNode(d[3]) %}
	| "module" __ Identifier _ "(" _ Parameters _ ")" _ Statement _ {% d => new ModuleNode(d[2], d[6], d[10]) %}
	| "function" __ Identifier _ "(" _ Parameters _ ")" _ "=" _ Expression _ ";" _ {% d => new FunctionNode(d[2], d[6], d[12]) %}
	| "{" _ Block _ "}" _ {% d => d[2] %}
	| Identifier _ "=" _ Expression _ ";" _ {% d => new VariableNode(d[0], d[4]) %}
	| ModuleInstantiation _ {% id %}

ModuleInstantiation ->
	SingleModuleInstantiation ChildrenInstantiation {% d => d[0].setChildren(d[1]) %}
	| SingleModuleInstantiation _ ";" {% id %}

ChildrenInstantiation ->
	"{" _ ModuleInstantiationList _ "}" {% d => d[2] %}
	| ModuleInstantiation

ModuleInstantiationList ->
	null
	| ModuleInstantiationList Statement {% d => _.flattenDeep(d) %}
	| ModuleInstantiationList ModuleInstantiation {% d => _.flattenDeep(d) %}

SingleModuleInstantiation ->
	Identifier _ "(" _ Arguments _ ")" _  {% d => new ActionNode(d[0], d[4]) %}
	| Identifier ":" __ SingleModuleInstantiation {% d => d[3].setLabel(d[0]) %}
	| "!" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}
	| "#" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}
	| "%" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}
	| "*" SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}

Expression ->
	"true" {% () => new BooleanValue(true) %}
	| "false" {% () => new BooleanValue(false) %}
	| Identifier {% d => new ReferenceValue(d[0]) %}
	#| Expression "." Identifier
	| String {% d => new StringValue(d[0]) %}
	| Float {% d => new NumberValue(d[0]) %}
	| "(" _ Expression _ ")" {% d => new ExpressionNode(d[2]) %}
	| "[" _ Expression _ ":" _ Expression _ "]" {% d => new RangeValue(d[2], d[6]) %}
	| "[" _ Expression _ ":" _ Expression _ ":" _ Expression _ "]" {% d => new RangeValue(d[2], d[10], d[6]) %}
	| "[" _ VectorExpression _ "]" {% d => new VectorValue(d[2]) %}
	| Expression _ "*" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "/" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "%" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "+" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "-" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "<" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "<=" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "==" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "!=" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ ">=" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ ">" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "&&" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| Expression _ "||" _ Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
	| "+" _ Expression {% d => d[2] %}
	| "-" _ Expression {% d => {
		if(_.isNumber(d[2]))
			return -d[2];
		else
			return d[2].setNegative(true);
	} %}
	| "!" _ Expression {% d => !d[2] %}
#	| Expression _ "?" _ Expression _ ":" _ Expression
#	| Expression _ "[" _ Expression _ "]"
#	| Identifier _ "(" _ Arguments _ ")"

String ->
	"\"" [^"\n]:* "\""  {% d => d[1].join('') %}

Float ->
	Integer "." Integer {% d => d[0] + d[1] + d[2] %}
	| Integer {% d => d[0] %}

Integer ->
	[0-9] {% d => d[0] %}
	| Integer [0-9] {% d => d[0] + d[1] %}

VectorExpression ->
	VectorExpression _ "," _ Expression {% d => _.concat(d[0], [d[4]]) %}
	| Expression {% d => d[0] %}

Parameters ->
	null
	| Parameters _ "," _ Parameter {% d => _.concat(d[0], [d[4]]) %}
	| Parameter {% id %}

Parameter ->
	Identifier {% id %}
	| Identifier _ "=" _ Expression {% d => ([d[0], d[4]]) %}

Arguments ->
	null
	| Arguments _ "," _ Argument {% d => _.concat(d[0], [d[4]]) %}
	| Argument {% id %}

Argument ->
	Identifier _ "=" _ Expression {% d => ([d[0], d[4]]) %}
	| Expression {% id %}

Path ->
	[^>]:+  {% d => d[0].join('') %}

Identifier ->
	[A-Za-z_$] {% d => d[0] %}
	| Identifier [A-Za-z0-9_] {% d => d[0] + d[1] %}