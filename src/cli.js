const SCADParser = require('./index');


const parser = new SCADParser();
try {
    let index = process.argv[2] || 1;
    const ast = parser.parseAST('../examples/ex' + index + '.scad');
    console.log(parser.getToken({
        character: 7,
        line: 14
    }, '../examples/ex' + index + '.scad'));
    console.log(ast.findByToken(parser.getToken({
        character: 7,
        line: 14
    }, '../examples/ex' + index + '.scad')).toString());
    console.log(ast.toString());
    console.log('done');
} catch (error) {
    console.log(error);
}

