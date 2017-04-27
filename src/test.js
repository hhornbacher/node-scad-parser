const expect = require('expect.js');

const SCADParser = require('../src');

let parser = new SCADParser();
describe('SCADParser', function () {


  it('should have created an instance of SCADParser', function () {
    expect(parser).to.be.a(SCADParser);
  });

  describe('Parse variables', function () {
    it('should parse number', function () {
      const root1 = parser.parseAST('number01.scad',
        'myNumber =1;'
      );
      expect(root1.children[0]).to.be.a(VariableNode);
      expect(root1.children[0].value.isEqual(new NumberValue([], '1'))).to.equal(true);
      const root2 = parser.parseAST('number02.scad',
        'myNumber=  -1.78;'
      );
      expect(root2.children[0]).to.be.a(VariableNode);
      expect(root2.children[0].value.isEqual(new NumberValue([], '1.78', true).setNegative(true))).to.equal(true);
      const root3 = parser.parseAST('number03.scad',
        'myNumber=1.78e86\n;'
      );
      expect(root3.children[0]).to.be.a(VariableNode);
      expect(root3.children[0].value.isEqual(new NumberValue([], '1.78e86'))).to.equal(true);
      expect(root3.children[0].value.isEqual(new NumberValue([], '23'))).to.equal(false);
    });

    it('should parse string', function () {
      const root = parser.parseAST('string.scad',
        'myStr ="a string";'
      );
      expect(root.children[0]).to.be.a(VariableNode);
      expect(root.children[0].value.isEqual(new StringValue([], 'a string'))).to.equal(true);
      expect(root.children[0].value.isEqual(new StringValue([], 'just wrong'))).to.equal(false);
    });

    it('should parse boolean', function () {
      const root = parser.parseAST('boolean.scad',
        'myBool =false;'
      );
      expect(root.children[0]).to.be.a(VariableNode);
      expect(root.children[0].value.isEqual(new BooleanValue([], false))).to.equal(true);
      expect(root.children[0].value.isEqual(new BooleanValue([], true))).to.equal(false);
    });

    it('should parse vector', function () {
      const root = parser.parseAST('vector.scad',
        'myVector = [1,[2,3]];'
      );
      expect(root.children[0]).to.be.a(VariableNode);
      expect(root.children[0].value.isEqual(
        new VectorValue([], [
          new NumberValue([], '1'),
          new VectorValue([], [
            new NumberValue([], '2'),
            new NumberValue([], '3')
          ])
        ])
      )).to.equal(true);
      expect(root.children[0].value.isEqual(
        new VectorValue([], [
          new NumberValue([], '1'),
          new NumberValue([], '2'),
          new NumberValue([], '3')
        ])
      )).to.equal(false);
    });

    it('should parse range', function () {
      const root1 = parser.parseAST('range01.scad',
        'myRange = [1:10];'
      );
      expect(root1.children[0]).to.be.a(VariableNode);
      expect(root1.children[0].value.isEqual(
        new RangeValue([],
          new NumberValue([], '1'), new NumberValue([], '10')
        )
      )).to.equal(true);
      const root2 = parser.parseAST('range02.scad',
        'myRange = [1:0.5:10];'
      );
      expect(root2.children[0]).to.be.a(VariableNode);
      expect(root2.children[0].value.isEqual(
        new RangeValue([],
          new NumberValue([], '1'), new NumberValue([], '10'), new NumberValue([], '0.5')
        )
      )).to.equal(true);
    });

    it('should parse reference', function () {
      const root1 = parser.parseAST('reference01.scad',
        'myRef = ref;'
      );
      expect(root1.children[0]).to.be.a(VariableNode);
      expect(root1.children[0].value.isEqual(new ReferenceValue([], 'ref'))).to.equal(true);
      expect(root1.children[0].value.isEqual(new ReferenceValue([], 'ref').setNegative(true))).to.equal(false);
      const root2 = parser.parseAST('reference02.scad',
        'myRef = -ref;'
      );
      expect(root2.children[0]).to.be.a(VariableNode);
      expect(root2.children[0].value.isEqual(new ReferenceValue([], 'ref').setNegative(true))).to.equal(true);
      expect(root2.children[0].value.isEqual(new ReferenceValue([], 'ref'))).to.equal(false);
    });

    it('should parse expression', function () {
      const root = parser.parseAST('vector.scad',
        'myVector = 5*7+6;'
      );
      expect(root.children[0]).to.be.a(VariableNode);
    });
  });

  describe('Parse examples', function () {
    it('should parse example 1', function () {
      const root = parser.parseAST('./examples/ex1.scad');
      expect(root.children.length).to.equal(23);
      console.log(root.findByValue("Hallo?"));
      expect(root.findByType('Variable').length).to.equal(2);
      expect(root.findByType('Module').length).to.equal(1);
      expect(root.findByType('Function').length).to.equal(1);
      expect(root.findByType('Action').length).to.equal(4);
      expect(root.findByName('test').length).to.equal(2);
      expect(root.findByName('XYZ').length).to.equal(0);
      expect(root.toString()).to.contain('Root');
    });
    it('should parse example 2', function () {
      const root = parser.parseAST('./examples/ex2.scad');
      expect(root.children.length).to.equal(26);
      expect(root.findByType('Variable').length).to.equal(1);
      expect(root.findByType('Module').length).to.equal(1);
      expect(root.findByType('Function').length).to.equal(0);
      expect(root.findByType('Action').length).to.equal(4);
      expect(root.findByName('color').length).to.equal(1);
      expect(root.findByName('XYZ').length).to.equal(0);
      expect(root.toString()).to.contain('Root');
    });
    it('should parse example 3', function () {
      const root = parser.parseAST('./examples/ex3.scad');
      expect(root.children.length).to.equal(29);
      expect(root.findByType('Variable').length).to.equal(3);
      expect(root.findByType('Module').length).to.equal(1);
      expect(root.findByType('Function').length).to.equal(0);
      expect(root.findByType('Action').length).to.equal(13);
      expect(root.findByName('cube').length).to.equal(3);
      expect(root.findByName('XYZ').length).to.equal(0);
      expect(root.toString()).to.contain('Root');
    });
    it('should parse example 4', function () {
      const root = parser.parseAST('./examples/ex4.scad');
      expect(root.children.length).to.equal(8);
      expect(root.findByType('Variable').length).to.equal(1);
      expect(root.findByType('Module').length).to.equal(0);
      expect(root.findByType('Function').length).to.equal(0);
      expect(root.findByType('Action').length).to.equal(0);
      expect(root.findByName('MyString').length).to.equal(1);
      expect(root.findByName('NotValid').length).to.equal(0);
      expect(root.toString()).to.contain('Root');
    });
  });

  describe('Throw errors', function () {
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
});