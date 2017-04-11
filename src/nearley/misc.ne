_ -> WhiteSpace:?
__ -> WhiteSpace
 
WhiteSpace ->
	[\r\n ]:+ {% d => null %}