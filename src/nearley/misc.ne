EndOfStatement ->
	_  ";" _

_ -> WhiteSpace:?
__ -> WhiteSpace
 
WhiteSpace ->
	[\r\n ]:+ {% d => null %}