"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expect = require("expect.js");
var _ = require("lodash");
var Random = require("random-js");
var index_1 = require("./ast/index");
var index_2 = require("./index");
var parser = new index_2.default();
var randEngine = Random.engines.nativeMath;
var miscStatements = [
    'color("blue") cube([1,2,3]);',
    'color("red") cube([5,6,7]) { x=3; echo("Hallo"); }',
    'action(a,b,c);',
    'variable=ref*3+x*x;'
];
var randMaps = {
    operators: '*/%+-'
};
var rand = {
    pick: function (values) { return Random.pick(randEngine, _.isString(values) ? values.split('') : values); },
    string: function (value, length) { return Random.string(value)(randEngine, length); },
    integer: function (min, max) { return Random.integer(min, max)(randEngine); },
    float: function (min, max, inclusive) { return Random.real(min, max, inclusive)(randEngine); },
    identifier: function () {
        var prefix = rand.pick('_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        var name = rand.string('_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', rand.integer(3, 9));
        return prefix + name;
    },
    statement: function (count) {
        if (count === void 0) { count = null; }
        if (!_.isNumber(count))
            return rand.pick(miscStatements);
        return _.times(count, function () { return rand.statement(); });
    },
    vector: function () {
        return "[" + _.times(rand.integer(3, 10), function () { return rand.value(true); }).join(', ') + "]";
    },
    value: function (noVect) {
        if (noVect === void 0) { noVect = false; }
        var value = 1;
        var mod = 5;
        if (noVect)
            mod = 4;
        switch (rand.integer(0, 100) % mod) {
            case 0:
                value = rand.integer(-10e6, 10e6);
                break;
            case 1:
                value = rand.float(-10e6, 10e6, true);
                break;
            case 2:
                value = rand.float(-10e6, 10e6, true).toExponential();
                break;
            case 3:
                value = rand.identifier();
                break;
            case 4:
                value = rand.vector();
                break;
        }
        return value;
    },
    expression: function () {
        var length = rand.integer(1, 6);
        var values = _.times(length, function () { return rand.value(); });
        var operators = _.times(length - 1, function () { return rand.pick(randMaps.operators); });
        return _.map(values, function (value, index) {
            return "" + value + (operators[index] ? operators[index] : '');
        }).join('');
    }
};
describe('SCADParser', function () {
    it('should have created an instance of SCADParser', function () {
        expect(parser).to.be.a(index_2.default);
    });
    describe('parseAST', function () {
        var statementTest = function (statement, file, expected, furtherTests) {
            if (furtherTests === void 0) { furtherTests = function () { }; }
            function truncateStatement(statement, max) {
                if (statement === void 0) { statement = ''; }
                if (max === void 0) { max = 64; }
                var placeholder = '...';
                var statementLength = statement.length;
                if (statementLength > max) {
                    var partA = statement.substring(0, max - placeholder.length - 1);
                    return "" + partA + placeholder;
                }
                return statement;
            }
            it("should parse " + (/^[aeiou].*/i.test(expected.name) ? 'an' : 'a') + " " + expected.name + ": " + JSON.stringify(truncateStatement(statement)), function () {
                var root = parser.parseAST(file, statement);
                expect(root.children).to.have.length(1);
                expect(root.children[0]).to.be.a(expected);
                furtherTests(root);
            });
        };
        describe('with variable statements as input', function () {
            var variableTest = function (value, varType, furtherTests) {
                if (value === void 0) { value = 1; }
                if (varType === void 0) { varType = index_1.Value; }
                if (furtherTests === void 0) { furtherTests = function () { }; }
                var name = rand.identifier();
                var statement = name + " = " + value + ";";
                var file = "var-" + name + "-" + varType.prototype.className + ".scad";
                statementTest(statement, file, index_1.VariableNode, function (root) {
                    expect(root.children[0].value).to.be.a(varType);
                    if (varType !== index_1.VectorValue &&
                        varType !== index_1.RangeValue) {
                        var cleanValue = value.toString().replace('-', '').replace(/"([^"]*)"/, '$1');
                        if (varType === index_1.BooleanValue)
                            cleanValue = cleanValue === 'true' ? true : false;
                        var expectedValue = new varType([], cleanValue);
                        if (value < 0 && expectedValue instanceof index_1.SignedValue)
                            expectedValue.setNegative(true);
                        expect(root.children[0].value.isEqual(expectedValue)).to.equal(true);
                    }
                    furtherTests(root.children[0].value);
                });
            };
            for (var i = 0; i < 5; i++) {
                variableTest(rand.integer(-10e6, 10e6), index_1.NumberValue);
            }
            for (var i = 0; i < 5; i++) {
                variableTest(rand.float(-10e6, 10e6, true), index_1.NumberValue);
            }
            for (var i = 0; i < 5; i++) {
                variableTest(rand.float(-10e6, 10e6, true).toExponential(), index_1.NumberValue);
            }
            for (var i = 0; i < 5; i++) {
                variableTest('"' + rand.string('_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', rand.integer(3, 30)) + '"', index_1.StringValue);
            }
            variableTest(true, index_1.BooleanValue);
            variableTest(false, index_1.BooleanValue);
            var _loop_1 = function (i) {
                var vectorValues = _.times(rand.integer(3, 30), function () { return rand.integer(-10e6, 10e6); });
                var vector = "[" + vectorValues.join(', ') + "]";
                variableTest(vector, index_1.VectorValue, function (value) {
                    expect(value.value).to.have.length(vectorValues.length);
                    var expected = new index_1.VectorValue([], _.map(vectorValues, function (expected) {
                        var expectedValue = new index_1.NumberValue([], expected.toString().replace('-', ''));
                        if (expected < 0)
                            expectedValue.setNegative(true);
                        return expectedValue;
                    }));
                    expect(value.isEqual(expected)).to.equal(true);
                });
            };
            for (var i = 0; i < 5; i++) {
                _loop_1(i);
            }
            for (var i = 0; i < 5; i++) {
                var range = "[" + _.times(rand.integer(2, 3), function () { return rand.integer(-10e6, 10e6); }).join(':') + "]";
                variableTest(range, index_1.RangeValue, function () {
                    /** @todo Check values */
                });
            }
            for (var i = 0; i < 5; i++) {
                variableTest(rand.identifier(), index_1.ReferenceValue);
            }
        });
        describe('with comment statements as input', function () {
            var slCommentStatement = '// Single line comment\n';
            var mlCommentStatement = '/* Multi\nline\ncomment */';
            statementTest(slCommentStatement, 'sl-comment.scad', index_1.CommentNode, function (root) {
                expect(root.children[0].text).to.equal('Single line comment');
                expect(root.children[0].multiline).to.equal(false);
            });
            statementTest(mlCommentStatement, 'ml-comment.scad', index_1.CommentNode, function (root) {
                expect(root.children[0].text).to.equal(' Multi\nline\ncomment ');
                expect(root.children[0].multiline).to.equal(true);
            });
        });
        describe('with include/use statements as input', function () {
            var includeStatement = 'include <file.scad>;';
            var useStatement = 'use <file.scad>;';
            statementTest(includeStatement, 'include.scad', index_1.IncludeNode, function (root) {
                expect(root.children[0].file).to.equal('file.scad');
            });
            statementTest(useStatement, 'use.scad', index_1.UseNode, function (root) {
                expect(root.children[0].file).to.equal('file.scad');
            });
        });
        describe('with module statements as input', function () {
            var moduleTest = function (statementCount) {
                var modStatements = rand.statement(statementCount);
                var moduleStatement = "module " + rand.identifier() + "() {\n" + modStatements.join('\n') + " }";
                statementTest(moduleStatement, 'module.scad', index_1.ModuleNode, function (root) {
                    expect(root.children[0].children).to.have.length(modStatements.length);
                });
            };
            for (var i = 0; i < 5; i++) {
                moduleTest(rand.integer(4, 8));
            }
        });
        describe('with function statements as input', function () {
            var functionTest = function () {
                var funcExpression = rand.expression();
                var functionStatement = "function " + rand.identifier() + "() = " + funcExpression + ";";
                statementTest(functionStatement, 'module.scad', index_1.FunctionNode, function () {
                });
            };
            for (var i = 0; i < 5; i++) {
                functionTest();
            }
        });
    });
    describe('Exceptions', function () {
        it('should throw an error, if neither code or file are passed to parseAST', function () {
            expect(parser.parseAST).to.throwException(/path must be a string or Buffer/);
        });
        it('should throw a lexer error on "&%!" as invalid code', function () {
            expect(function () {
                try {
                    parser.parseAST('lexer_error.scad', '&%!;');
                }
                catch (error) {
                    throw error;
                }
            }).to.throwException(/Lexer error/);
        });
        it('should throw a parser error on "myVar module ;" as invalid code', function () {
            expect(function () {
                try {
                    parser.parseAST('parser_error.scad', 'myVar module ;');
                }
                catch (error) {
                    throw error;
                }
            }).to.throwException(/Parser error/);
        });
    });
});
//# sourceMappingURL=test.js.map