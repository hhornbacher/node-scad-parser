const expect = require('expect.js');

const SCADParser = require('../src');

let parser = new SCADParser();
describe('SCADParser', function () {
  it('should have created an instance of SCADParser', function () {
    expect(parser).to.be.a(SCADParser);
  });

  it('should parse number variables', function () {
    const root1 = parser.parseAST('number01.scad',
      'myNumber =1;'
    );
    expect(root1.children[0]).to.be.a(VariableNode);
    const root2 = parser.parseAST('number02.scad',
      'myNumber=  -1.78;'
    );
    expect(root2.children[0]).to.be.a(VariableNode);
    const root3 = parser.parseAST('number03.scad',
      'myNumber=1.78e86\n;'
    );
    expect(root3.children[0]).to.be.a(VariableNode);
  });

  it('should parse string variables', function () {
    const root = parser.parseAST('string.scad',
      'myStr ="a string";'
    );
    expect(root.children[0]).to.be.a(VariableNode);
  });

  it('should parse boolean variables', function () {
    const root = parser.parseAST('boolean.scad',
      'myBool =false;'
    );
    expect(root.children[0]).to.be.a(VariableNode);
  });

  it('should parse vector variables', function () {
    const root = parser.parseAST('vector.scad',
      'myVector = [1,[2,3]];'
    );
    expect(root.children[0]).to.be.a(VariableNode);
  });

  it('should parse range variables', function () {
    const root1 = parser.parseAST('range01.scad',
      'myRange = [1:10];'
    );
    expect(root1.children[0]).to.be.a(VariableNode);
    const root2 = parser.parseAST('range02.scad',
      'myRange = [1:0.5:10];'
    );
    expect(root2.children[0]).to.be.a(VariableNode);
  });

  it('should parse reference variables', function () {
    const root1 = parser.parseAST('reference01.scad',
      'myRef = ref;'
    );
    expect(root1.children[0]).to.be.a(VariableNode);
    const root2 = parser.parseAST('reference02.scad',
      'myRef = -ref;'
    );
    expect(root2.children[0]).to.be.a(VariableNode);
  });

  it('should parse expression variables', function () {
    const root = parser.parseAST('vector.scad',
      'myVector = 5*7+6;'
    );
    expect(root.children[0]).to.be.a(VariableNode);
  });

  it('should parse example 1', function () {
    const root = parser.parseAST('./examples/ex1.scad');
    expect(root.children.length).to.equal(22);
    expect(root.toString()).to.contain('Root');
  });
  it('should parse example 2', function () {
    const root = parser.parseAST('./examples/ex2.scad');
    expect(root.children.length).to.equal(22);
    expect(root.toString()).to.contain('Root');
  });
  it('should parse example 3', function () {
    const root = parser.parseAST('./examples/ex3.scad');
    expect(root.children.length).to.equal(44);
    expect(root.toString()).to.contain('Root');
  });
  it('should parse example 4', function () {
    const root = parser.parseAST('./examples/ex4.scad');
    expect(root.children.length).to.equal(8);
    expect(root.toString()).to.contain('Root');
  });

  it('should throw an error, if neither code or file are passed to parseAST', function () {
    expect(parser.parseAST).to.throwException(/You have to pass either code or file parameter!/);
  });

  it('should throw a lexer error on "&%!" as invalid code', function () {
    expect(function () {
      try {
        parser.parseAST('lexer_error.scad',
          '&%!;'
        );
      } catch (error) {
        throw error;
      }
    }).to.throwException(/Lexer error/);
  });

  it('should throw a parser error on "myVar module ;" as invalid code', function () {
    expect(function () {
      try {
        parser.parseAST('parser_error.scad',
          'myVar module ;'
        );
      } catch (error) {
        throw error;
      }
    }).to.throwException(/Parser error/);
  });
});