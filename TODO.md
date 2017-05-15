# Features to implement

* [ ]  Fix ModuleInstantiation, ChildrenInstantiation and SingleModuleInstantiation: It throws an parser error, when trying to parse children instatiation, like: `color("green") transform([0,1,2]) cube([1,1,1]);`
* [ ]  Finish `Node.findByToken` to also find `ExpressionNode`s and `Value`s
* [ ]  Integrate OpenSCAD for optional rendering
    * [ ]  Preview (File/Module)
    * [ ]  Compile animation
* [ ]  Implement `for` loops
* [ ]  Implement `if` / `else` statements
