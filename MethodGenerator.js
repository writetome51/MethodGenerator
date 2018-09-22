"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SelfIdentifiable_1 = require("./SelfIdentifiable");
var object_manipulation_1 = require("../functions/datatype-handlers/objects/object_manipulation");
/**********************
 I don't know how reusable this class is.  It was originally written to
 automatically generate methods for the ArrayEditor class.  ArrayEditor has properties
 that are instances of other classes, each with its own set of methods.  I wanted to
 use those properties (but keep them private) by creating substitute methods for each
 one of their methods, which would then call the original method and then return the
 ArrayEditor instance so you could chain other method calls one after another.
 The resulting methods are named using this convention: this.propertyName_methodName() .
 So for instance, ArrayEditor has a property '_remove', which has a method
 'adjacentItems()'.  Its substitute method would automatically be called
 this.remove_adjacentItems().

 MethodGenerator should be injected into the constructor of the target class (such
 as ArrayEditor), have its properties (targetInstance and nameofFunctionToCallInEachNewMethod) set,
 and then you call its method generatePublicMethodsFor(), with an array of the necessary
 property names passed into it.  Look at the constructor of ArrayEditor for reference.

 nameofFunctionToCallInEachNewMethod needs to be a method belonging to targetInstance.

 Only non-inherited methods of the specified properties will have substitute functions
 generated. Private and protected methods are ignored.  It's assumed you're giving
 private/protected methods names beginning with underscores, so only methods that
 don't begin with an underscore will automatically get a substitute method.

 Also important: since the methods aren't generated until runtime, when you're writing
 code that calls them, a linting tool like TSLint will tell you these methods
 don't exist.  Tell TSLint to stuff its face.
 **********************/
var MethodGenerator = /** @class */ (function (_super) {
    __extends(MethodGenerator, _super);
    function MethodGenerator(targetInstance, nameofFunctionToCallInEachNewMethod) {
        var _this = _super.call(this) || this;
        _this.targetInstance = targetInstance;
        _this.nameofFunctionToCallInEachNewMethod = nameofFunctionToCallInEachNewMethod;
        return _this;
    }
    // prependPropertyName, if true, will cause this to create new method names
    // that begin with the property name.  If false, the property name will be left out.
    MethodGenerator.prototype.generatePublicMethodsFor = function (properties, prependPropertyName) {
        var _this = this;
        if (prependPropertyName === void 0) { prependPropertyName = true; }
        properties.forEach(function (property) {
            var methodNames = (object_manipulation_1.getUninheritedPublicMethods(_this.targetInstance[property]));
            methodNames.forEach(function (methodName) {
                _this._createNewMethodFor(methodName, property, prependPropertyName);
            });
        });
    };
    MethodGenerator.prototype._createNewMethodFor = function (methodName, objName, prependPropertyName) {
        var newMethodName = this._createNewMethodNameFrom(methodName, objName, prependPropertyName);
        // this._nameofFunctionToCall MUST be passed in as argument.
        this.targetInstance[newMethodName] =
            this._getNewMethod(objName, methodName, this.nameofFunctionToCallInEachNewMethod);
    };
    // this._nameofFunctionToCall MUST be passed in as argument.
    //  This is because the value of 'this' changes inside RETURNED FUNCTION.
    MethodGenerator.prototype._getNewMethod = function (objName, objectsMethodName, nameOfFunctionToCall) {
        // RETURNED FUNCTION.  When this function is called as a method of targetInstance,
        // 'this' becomes a reference to targetInstance.
        // Simply referring to this.targetInstance will give you error.
        return function () {
            var parameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                parameters[_i] = arguments[_i];
            }
            return this[nameOfFunctionToCall](this[objName], this[objName][objectsMethodName], Object.values(arguments) // shouldn't this be parameters?
            );
        };
    };
    MethodGenerator.prototype._createNewMethodNameFrom = function (methodName, objName, prependPropertyName) {
        // remove any underscores from beginning of objName:
        while (objName[0] === '_') {
            objName = objName.substr(1);
        }
        if (prependPropertyName) {
            return objName + '_' + methodName;
        }
        else {
            return methodName;
        }
    };
    return MethodGenerator;
}(SelfIdentifiable_1.SelfIdentifiable));
exports.MethodGenerator = MethodGenerator;
