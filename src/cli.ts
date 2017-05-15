#!/usr/bin/node

import SCADParser from './index';
import * as path from 'path';


const parser = new SCADParser();
let index = process.argv[2] || 1;
const file = path.resolve(__dirname,'../examples/ex' + index + '.scad');

try {
    const ast = parser.parseAST(file);
    /*const token = parser.getToken(14, 23, file);
    console.log(ast.findByToken(token));*/
    console.log(ast.toCode());
    console.log(ast.toString());
    /*parser.render(null, file, {
        outputFile: './out.png',
        format: 'png',
        colorScheme: 'Starnight'
    })*/
    console.log('done');
} catch (error) {
    console.log(error);
}

