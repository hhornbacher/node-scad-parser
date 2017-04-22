const expect = require('expect.js');

const SCADParser = require('../src');

let parser = new SCADParser();
describe('SCADParser', function () {
  it('should have created an instance of SCADParser', function () {
    expect(parser).to.be.a(SCADParser);
  });

  it('should throw an error, if neither code or file are passed to parseAST', function () {
    expect(parser.parseAST).to.throwException(/You have to pass either code or file parameter!/);
  });

  it('should parse example 1', function () {
    const root = parser.parseAST('./examples/ex1.scad');
    expect(root.children.length).to.equal(19);
  });

  describe('Variable definitions', function () {
    it('should parse numbers', function () {
      const root1 = parser.parseAST('number01.scad',
        'myNumber =1;'
      );
      expect(root1.children[0]).to.be.a(VariableNode);
      const root2 = parser.parseAST('number02.scad',
        'myNumber=  1.78;'
      );
      expect(root2.children[0]).to.be.a(VariableNode);
      const root3 = parser.parseAST('number03.scad',
        'myNumber=1.78e86\n;'
      );
      expect(root3.children[0]).to.be.a(VariableNode);
    });
  });
});