"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Value types of the scad language
 *
 */
var _ = require("lodash");
/**
 * Base value class
 *
 */
var Value = (function () {
    function Value(tokens, value) {
        this.tokens = tokens;
        this.value = value;
    }
    /**
     * Check if values are equal
     *
     *
     *
     */
    Value.prototype.isEqual = function (value) {
        if (typeof value === typeof this
            && this.value === value.value)
            return true;
        return false;
    };
    /**
     * Get the string representation of this object
     *
     *
     */
    Value.prototype.toString = function () {
        return "" + this.value;
    };
    Value.prototype.toCode = function () {
        return "" + this.value;
    };
    return Value;
}());
exports.Value = Value;
var SignedValue = (function (_super) {
    __extends(SignedValue, _super);
    function SignedValue(tokens, value) {
        var _this = _super.call(this, tokens, value) || this;
        _this.negative = false;
        return _this;
    }
    /**
     * (Un-)Set the negative flag for this value
     *
     *
     *
     */
    SignedValue.prototype.setNegative = function (negative) {
        this.negative = negative;
        return this;
    };
    /**
     * Get the string representation of this object
     *
     *
     */
    SignedValue.prototype.toString = function () {
        return "" + (this.negative ? '-' : '') + this.value;
    };
    SignedValue.prototype.toCode = function () {
        return "" + (this.negative ? '-' : '') + this.value;
    };
    return SignedValue;
}(Value));
exports.SignedValue = SignedValue;
/**
 * Number type
 *
 */
var NumberValue = (function (_super) {
    __extends(NumberValue, _super);
    function NumberValue(tokens, value) {
        var _this = _super.call(this, tokens, value) || this;
        var instance = _this.constructor;
        _this.className = instance.name;
        return _this;
    }
    return NumberValue;
}(SignedValue));
exports.NumberValue = NumberValue;
/**
 * Boolean type
 *
 */
var BooleanValue = (function (_super) {
    __extends(BooleanValue, _super);
    function BooleanValue(tokens, value) {
        var _this = _super.call(this, tokens, value) || this;
        var instance = _this.constructor;
        _this.className = instance.name;
        return _this;
    }
    return BooleanValue;
}(Value));
exports.BooleanValue = BooleanValue;
/**
 * String type
 *
 */
var StringValue = (function (_super) {
    __extends(StringValue, _super);
    function StringValue(tokens, value) {
        var _this = _super.call(this, tokens, value) || this;
        var instance = _this.constructor;
        _this.className = instance.name;
        return _this;
    }
    StringValue.prototype.toCode = function () {
        return "\"" + this.value + "\"";
    };
    return StringValue;
}(Value));
exports.StringValue = StringValue;
/**
 * Vector type
 *
 */
var VectorValue = (function (_super) {
    __extends(VectorValue, _super);
    function VectorValue(tokens, value) {
        var _this = _super.call(this, tokens, value) || this;
        var instance = _this.constructor;
        _this.className = instance.name;
        return _this;
    }
    /**
     * Check if values are equal
     *
     */
    VectorValue.prototype.isEqual = function (value) {
        var out = false;
        if (value instanceof VectorValue) {
            out = this.value.length > 0;
            _.each(this.value, function (val, key) {
                if (!val.isEqual(value.value[key])) {
                    out = false;
                    return false;
                }
            });
        }
        return out;
    };
    VectorValue.prototype.toString = function () {
        return "[" + _.map(this.value, function (value) { return value.toString(); }).join(', ') + "]";
    };
    VectorValue.prototype.toCode = function () {
        return "[" + _.map(this.value, function (value) { return value.toString(); }).join(', ') + "]";
    };
    return VectorValue;
}(Value));
exports.VectorValue = VectorValue;
/**
 * Range type
 *
 */
var RangeValue = (function (_super) {
    __extends(RangeValue, _super);
    function RangeValue(tokens, start, end, increment) {
        if (increment === void 0) { increment = new NumberValue([], 1); }
        var _this = _super.call(this, tokens, [start, increment, end]) || this;
        _this.start = start;
        _this.end = end;
        _this.increment = increment;
        var instance = _this.constructor;
        _this.className = instance.name;
        return _this;
    }
    /**
     * Check if values are equal
     *
     */
    RangeValue.prototype.isEqual = function (value) {
        if (value instanceof RangeValue
            && this.start.isEqual(value.start)
            && this.end.isEqual(value.end)
            && this.increment.isEqual(value.increment))
            return true;
        return false;
    };
    RangeValue.prototype.toString = function () {
        return "[" + this.start.toString() + ":" + this.increment.toString() + ":" + this.end.toString() + "]";
    };
    RangeValue.prototype.toCode = function () {
        return "[" + this.start.toCode() + ":" + this.increment.toCode() + ":" + this.end.toCode() + "]";
    };
    return RangeValue;
}(Value));
exports.RangeValue = RangeValue;
/**
 * Reference type
 *
 */
var ReferenceValue = (function (_super) {
    __extends(ReferenceValue, _super);
    function ReferenceValue(tokens, reference) {
        var _this = _super.call(this, tokens, reference) || this;
        var instance = _this.constructor;
        _this.className = instance.name;
        return _this;
    }
    /**
     * Check if values are equal
     *
     */
    ReferenceValue.prototype.isEqual = function (value) {
        if (value instanceof ReferenceValue
            && this.negative === value.negative
            && this.value === value.value)
            return true;
        return false;
    };
    return ReferenceValue;
}(SignedValue));
exports.ReferenceValue = ReferenceValue;
//# sourceMappingURL=values.js.map