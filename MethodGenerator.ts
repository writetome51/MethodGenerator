import { SelfIdentifiable } from "self-identifiable/SelfIdentifiable";
import { getUninheritedPublicMethods }
	from 'intuitive-object-handlers/get/getUninheritedPublicMethods';

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


export class MethodGenerator extends SelfIdentifiable {

	constructor(
		public targetInstance: object,
		public nameofFunctionToCallInEachNewMethod: string) {

		super();
	}


	// prependPropertyName, if true, will cause this to create new method names
	// that begin with the property name.  If false, the property name will be left out.
	generatePublicMethodsFor(properties: string[], prependPropertyName = true) {
		properties.forEach((property) => {
			let methodNames = getUninheritedPublicMethods(this.targetInstance[property]);
			methodNames.forEach((methodName) => {
				this._createNewMethodFor(methodName, property, prependPropertyName);
			});
		});
	}


	private _createNewMethodFor(methodName, objName, prependPropertyName) {
		let newMethodName = this._createNewMethodNameFrom(methodName, objName, prependPropertyName);

		// this._nameofFunctionToCall MUST be passed in as argument.
		this.targetInstance[newMethodName] =
			this._getNewMethod(objName, methodName, this.nameofFunctionToCallInEachNewMethod);
	}


	// this._nameofFunctionToCall MUST be passed in as argument.
	//  This is because the value of 'this' changes inside RETURNED FUNCTION.
	private _getNewMethod(objName, objectsMethodName: string, nameOfFunctionToCall) {

		// RETURNED FUNCTION.  When this function is called as a method of targetInstance,
		// 'this' becomes a reference to targetInstance.
		// Simply referring to this.targetInstance will give you error.
		return function (...parameters: any[]) {

			return this[nameOfFunctionToCall](
				this[objName],
				this[objName][objectsMethodName],
				// @ts-ignore
				Object.values(arguments) // shouldn't this be parameters?
			);
		};
	}


	private _createNewMethodNameFrom(methodName, objName, prependPropertyName) {
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
	}


}
