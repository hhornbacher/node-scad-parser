ValueNode ->
	NumberValue  {% d => d[0] %}
	| VectorValue {% d => d[0] %}
    | RangeValue {% d => d[0] %}
    | StringValue {% d => d[0] %}
    | ReferenceValue {% d => d[0] %} 

StringValue ->
    "\"" [^"]:+ "\"" {% d => new StringValue(_.flattenDeep(d[1]).join('')) %}

ReferenceValue -> 
    Name {% d => {
		if(d[0] === 'true')
			return new BooleanValue(true);
		else if(d[0] === 'false')
			return new BooleanValue(false);
		else
			return new ReferenceValue(d[0], false);
	} %}
    | "-" _ Name {% d => new ReferenceValue(d[2], true) %}

RangeValue ->
	"[" _ ValueNode _ ":" _ ValueNode _ "]"  {% d => new RangeValue(d[2], d[6]) %}
	| "[" _ ValueNode _ ":" _ ValueNode _ ":" _ ValueNode _ "]"  {% d => new RangeValue(d[2], d[10], d[6]) %}

VectorValue ->
	"[" _ VectorList _ "]"  {% d => new VectorValue(d[2], false) %}
    | "-" _ "[" _ VectorList _ "]" {% d => new VectorValue(d[4], true) %}

VectorList ->
	ValueNode {% d => d[0] %}
	| VectorList _ "," _ ValueNode {% d => _.flattenDeep([d[0], d[4]]) %}

NumberValue ->
	Float {% d => new NumberValue(parseFloat(d[0]), false) %}
	| Integer {% d => new NumberValue(parseFloat(d[0]), false) %}
	| "-" _ Float {% d => new NumberValue(parseFloat(d[2]), true) %}
	| "-" _ Integer {% d => new NumberValue(parseFloat(d[2]), true) %}

Float ->
	Integer "." Integer {% d => d[0] + d[1] + d[2] %}

Integer ->
	[0-9] {% d => d[0] %}
	| Integer [0-9] {% d => d[0] + d[1] %}