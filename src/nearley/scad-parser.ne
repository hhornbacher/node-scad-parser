@{% 
	
const nm = require('./nearley-moo');
nm(require('./state-start.js'));
nm(require('./state-comment.js'));


require('../ast');

let counter=0;

%}
 
@builtin "whitespace.ne"

Block -> 
	Statement
	| Block Statement {% d => _.concat(d[0], d[1]) %}

Statement -> 
	%eol {% () => null %}
	| %comment {% d => new CommentNode(d[0].value) %}
	| %lcomment %eol:? %icomment %eol:? %rcomment {% d => new CommentNode(d[2].value, true) %}
	| %keyword_include %lpath %path %rpath %eos {% d => new IncludeNode(d[2].value) %}
	| %keyword_use %lpath %path %rpath %eos {% d => new UseNode(d[2].value) %}
	| %keyword_module %identifier %lparent Parameters:? %rparent {% d => new ModuleNode(d[1].value, d[3]/*, d[10]*/) %}
	#| %keyword_function %identifier %lparent Parameters %rparent %assign Expression %eos {% d => new FunctionNode(d[2]/*, d[6], d[12]*/) %}
	#| %lblock Block %rblock {% d => d[2] %}
	| %identifier %assign Expression %eos {% d => new VariableNode(d[0].value, d[2]) %}
	#| ModuleInstantiation {% id %}

Expression -> 
	%keyword_true {% () => new BooleanValue(true) %}
	| %keyword_false {% () => new BooleanValue(false) %}
	| %identifier {% d => new ReferenceValue(d[0].value) %}
	#| Expression "." %identifier
	| %float {% d => new NumberValue(d[0].value) %}
	| %string {% d => new StringValue(d[0].value) %}
#	| %lparent Expression %rparent {% d => new ExpressionNode(d[2]) %}
#	| %lvect Expression %seperator Expression %rvect {% d => new RangeValue(d[2], d[6]) %}
#	| %lvect Expression %seperator Expression %seperator Expression %rvect {% d => new RangeValue(d[2], d[10], d[6]) %}
#	| %lvect VectorExpression %rvect {% d => new VectorValue(d[2]) %}
#	| Expression "*" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "/" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "%" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "+" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "-" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "<" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "<=" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "==" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "!=" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression ">=" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression ">" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "&&" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| Expression "||" Expression {% d => new ExpressionNode(d[0], d[4], d[2]) %}
#	| %positive Expression {% d => d[2] %}
#	| %negative Expression {% d => {
#		if(_.isNumber(d[2]))
#			return -d[2];
#		else
#			return d[2].setNegative(true);
#	} %}
#	| "!" Expression {% d => !d[2] %}
#	| Expression "?" Expression ":" Expression
#	| Expression %lvect Expression %rvect
#	| %identifier "(" Arguments ")"

Parameters ->
	Parameter {% id %}
	| Parameters %comma Parameter {% d => _.concat(d[0], [d[4]]) %}

Parameter ->
	%identifier {% id %}
	#| %identifier %assign Expression {% d => ([d[0], d[4]]) %}


RootNode ->
	Block {% d => new RootNode(d[0]) %}

ModuleInstantiation ->
	SingleModuleInstantiation ChildrenInstantiation {% d => d[0].setChildren(d[1]) %}
	| SingleModuleInstantiation %eos {% id %}

ChildrenInstantiation ->
	%lblock Block %rblock {% d => d[2] %}
	| ModuleInstantiation

SingleModuleInstantiation ->
	%identifier %lparent %rparent  {% d => new ActionNode(d[0]) %}
	| %identifier %lparent Arguments %rparent  {% d => new ActionNode(d[0], d[4]) %}
	| %identifier %seperator SingleModuleInstantiation {% d => d[3].setLabel(d[0]) %}
	| %modifier SingleModuleInstantiation {% d => d[1].setModifier(d[0]) %}

VectorExpression ->
	Expression
	| VectorExpression %comma Expression {% d => {
		console.log(d[0], d[4]);
		counter++;
		if(counter>10)
			process.exit(0);
		return d[0].push(d[4]); 
	} %}

Arguments ->
	Argument {% id %}
	| Arguments %comma Argument {% d => _.concat(d[0], [d[4]]) %}

Argument ->
	Expression {% id %}
	| %identifier %assign Expression {% d => ([d[0], d[4]]) %}