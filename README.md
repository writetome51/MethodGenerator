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