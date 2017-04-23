@{% 
	
/**
 * Nearley SCAD grammar
 * @module nearley/grammar
 */

require('./tokens')();
require('../ast');

const pickTokens = (match) => _.filter(match, token => {
	if(token.constructor.name === 'Object')
		return true;
	return false;
});

%}

Block -> 
	Statement
	| Block Statement {% d => _.concat(d[0], d[1]) %}


Statement -> 
	%comment {% d => new CommentNode(pickTokens(d), d[0].value) %}
	| %mlComment {% d => new CommentNode(pickTokens(d), d[0].value, true) %}
	| %include %eos {% d => new IncludeNode(pickTokens(d), d[0].value) %}
	| %use %eos {% d => new UseNode(pickTokens(d), d[0].value) %}
	| %moduleDefinition %rparent %lblock Block %rblock {% d => new ModuleNode(pickTokens(d), d[0].value, d[3]) %}
	| %moduleDefinition Parameters %rparent %lblock Block %rblock {% d => new ModuleNode(pickTokens(d), d[0].value, d[1], d[4]) %}
	| %functionDefinition %rparent %assign Expression %eos {% d => new FunctionNode(pickTokens(d), d[0].value, null, d[3]) %}
	| %functionDefinition Parameters %rparent %assign Expression %eos {% d => new FunctionNode(pickTokens(d), d[0].value, d[1], d[4]) %}
	| %identifier %assign Expression %eos {% d => new VariableNode(pickTokens(d), d[0].value, d[2]) %}
	| ModuleInstantiation {% id %}


ModuleInstantiation ->
	SingleModuleInstantiation ChildrenInstantiation {% d => d[0].setChildren(d[1]) %}
	| SingleModuleInstantiation %eos {% id %}

ChildrenInstantiation ->
	%lblock Block %rblock {% d => d[1] %}
	| ModuleInstantiation

SingleModuleInstantiation ->
	%actionCall %rparent  {% d => new ActionNode(pickTokens(d), d[0].value) %} 
	| %actionCall Arguments %rparent  {% d => new ActionNode(pickTokens(d), d[0].value, d[1]) %}


Expression -> 
	%bool_true {% d => new BooleanValue(pickTokens(d), true) %}
	| %bool_false {% d => new BooleanValue(pickTokens(d), false) %}
	| %identifier {% d => new ReferenceValue(pickTokens(d), d[0].value) %}
	#| Expression "." %identifier
	| %float {% d => new NumberValue(pickTokens(d), d[0].value) %}
	| %string {% d => new StringValue(pickTokens(d), d[0].value) %}
	| %lparent Expression %rparent {% d => new ExpressionNode(pickTokens(d), d[1]) %}
	| %lvect Expression %seperator Expression %rvect {% d => new RangeValue(pickTokens(d), d[1], d[3]) %}
	| %lvect Expression %seperator Expression %seperator Expression %rvect {% d => new RangeValue(pickTokens(d), d[1], d[5], d[3]) %}
	| %lvect VectorExpression %rvect {% d => new VectorValue(pickTokens(d), d[1]) %}
	| Expression %operator1 Expression {% d => new ExpressionNode(pickTokens(d), d[0], d[2], d[1]) %}
	| Expression %operator2 Expression {% d => new ExpressionNode(pickTokens(d), d[0], d[2], d[1]) %}
	| Expression %operator3 Expression {% d => new ExpressionNode(pickTokens(d), d[0], d[2], d[1]) %}
	| %operator2 Expression {% d => {
		if((_.isNumber(d[1])||!_.isFunction(d[1].setNegative)) && d[0].value === '-')
			return -d[1];
		else if(d[0].value === '-')
			return d[1].setNegative(true);
	} %}
#	| "!" Expression {% d => !d[2] %}
#	| Expression "?" Expression ":" Expression
#	| Expression %lvect Expression %rvect
#	| %identifier "(" Arguments ")"

Parameters ->
	Parameter {% id %}
	| Parameters %comma Parameter {% d => _.concat(d[0], [d[2]]) %}

Parameter ->
	%identifier {% id %}
	| %identifier %assign Expression {% d => ([d[0], d[2]]) %}



VectorExpression ->
	%comment:? Expression %comment:? {% d => ([d[1]]) %}
	| VectorExpression %comma %comment:? Expression %comment:? {% d => _.concat(d[0], [d[3]]) %}

Arguments ->
	Argument {% id %}
	| Arguments %comma Argument {% d => _.concat(d[0], [d[2]]) %}

Argument ->
	Expression {% id %}
	| %identifier %assign Expression {% d => ([d[0], d[4]]) %}