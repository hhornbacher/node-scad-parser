@{% 
	
require('./tokens');
require('../ast');

%}
 
@builtin "whitespace.ne"

Block -> 
	Statement
	| Block Statement {% d => _.concat(d[0], d[1]) %}


Statement -> 
	%comment {% d => new CommentNode(d[0], d[0].value) %}
	| %lcomment %icomment %rcomment {% d => new CommentNode(d[0], d[1].value, true) %}
	| %include %eos {% d => new IncludeNode(d[0], d[0].value) %}
	| %use %eos {% d => new UseNode(d[0], d[0].value) %}
	| %keyword_module %identifier %lparent Parameters:? %rparent {% d => new ModuleNode(d[0], d[1].value, d[3]/*, d[10]*/) %}
	| %keyword_function %identifier %lparent Parameters:? %rparent %assign Expression %eos {% d => new FunctionNode(d[0], d[2].value/*, d[6], d[12]*/) %}
	| %lblock Block %rblock {% d => d[1] %}
	| %identifier %assign Expression %eos {% d => new VariableNode(d[0], d[0].value, d[2]) %}
	| ModuleInstantiation {% id %}


ModuleInstantiation ->
	SingleModuleInstantiation ChildrenInstantiation {% d => d[0].setChildren(d[1]) %}
	| SingleModuleInstantiation %eos {% id %}

ChildrenInstantiation ->
	%lblock Block %rblock {% d => d[1] %}
	| ModuleInstantiation

SingleModuleInstantiation ->
	%identifier %lparent %rparent  {% d => new ActionNode(d[0], d[0].value) %}
	| %identifier %lparent Arguments %rparent  {% d => new ActionNode(d[0], d[0].value, d[4]) %}
	| %identifier %seperator SingleModuleInstantiation {% d => d[3].setLabel(d[0].value) %}


Expression -> 
	%keyword_true {% d => new BooleanValue(d[0], true) %}
	| %keyword_false {% d => new BooleanValue(d[0], false) %}
	| %identifier {% d => new ReferenceValue(d[0], d[0].value) %}
	#| Expression "." %identifier
	| %float {% d => new NumberValue(d[0], d[0].value) %}
	| %string {% d => new StringValue(d[0], d[0].value) %}
	| %lparent Expression %rparent {% d => new ExpressionNode(d[1]) %}
	| %lvect Expression %seperator Expression %rvect {% d => new RangeValue(d[0], d[1], d[3]) %}
	| %lvect Expression %seperator Expression %seperator Expression %rvect {% d => new RangeValue(d[0], d[1], d[5], d[3]) %}
	| %lvect VectorExpression %rvect {% d => new VectorValue(d[0], d[1]) %}
	| Expression %operator1 Expression {% d => new ExpressionNode(d[0], d[2], d[1]) %}
	| Expression %operator2 Expression {% d => new ExpressionNode(d[0], d[2], d[1]) %}
	| Expression %operator3 Expression {% d => new ExpressionNode(d[0], d[2], d[1]) %}
	| %operator2 Expression {% d => {
		if(_.isNumber(d[1]) && d[0].value === '-')
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