@{% 
    require('../ast');
%}

RootNode -> (StatementNode:*) {% d => _.flattenDeep(d) %}

StatementNode ->
	Variable WhiteSpace:?  ";" WhiteSpace:?  {% d => d[0] %}

Variable -> Name WhiteSpace:?  "=" WhiteSpace:? Value {% d => ({name:d[0], value:d[4]}) %}

Value ->
	Number {% d => {
        let val = parseFloat(d[0]);
        let negative = val<0;
        if(negative)
            val*=-1;
        return new NumberValue(val, negative);
    } %} 
    | Reference {% d => d[0] %}

Reference -> 
    Name {% d => new ReferenceValue(d[0], false) %}
    | "-" Name {% d => new ReferenceValue(d[0], true) %}
	
Name ->
	[A-Za-z_$] {% d => d[0] %}
	| Name [A-Za-z0-9_] {% d => d[0] + d[1] %}

Number ->
	Float {% d => d[0] %}
	| Integer {% d => d[0] %}
	| "-" WhiteSpace:? Float {% d => d[0] + d[2] %}
	| "-" WhiteSpace:? Integer {% d => d[0] + d[2] %}

Float ->
	Integer "." Integer {% d => d[0] + d[1] + d[2] %}

Integer ->
	[0-9] {% d => d[0] %}
	| Integer [0-9] {% d => d[0] + d[1] %}


WhiteSpace -> [\r\n\r ]:+ {% d => null %}