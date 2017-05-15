# node-scad-parser
Module to parse the abstract syntax tree of OpenSCAD files

## Attention
This is still **beta stage**, at the moment I'm busy porting the code from JS to TS.

## Commands
* ```npm start```: Run cli.js with nodemon and node-ts
* ```npm run build```: Build all
* ```npm run build:grammar```: Generate the grammar from src/nearley/grammar.ne
* ```npm run build:docs```: Generate the documentation files
* ```npm run build:lib```: Compile the TS code to JS code
* ```npm run test:live```: Run unit tests and watch for file changes
* ```npm test```: Run unit tests

## Credits
* Thanks to the OpenSCAD team for this great programmatic CAD tool: [OpenSCAD](https://github.com/openscad/openscad)
* Also thanks to all the Nearley contributors, for supplying an awesome parser generator for JS: [Nearley](https://github.com/Hardmath123/nearley/)
* And last but not least, thanks for Moo, the lexer library powering this parser: [Moo](https://github.com/tjvr/moo/)
