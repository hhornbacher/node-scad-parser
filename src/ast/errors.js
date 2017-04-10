const _ = require('lodash');

module.exports = function Errors(registerClass) {

    class SCADSyntaxError extends Error {
        constructor(file, tracer, {message, expected, found, location}) {
            super(message);

            _.extend(this, new SCADBaseClass({
                expected,
                found,
                location: new Location(location),
                trace: _.slice(tracer.stackTrace, tracer.stackTrace.length-10),
                file
            }));
        }

        get className() {
            return this.constructor.name;
        }

        toString() {
            return `SCAD syntax error:\n${getCodeExcerpt(this.location, this.message)}`; // \n${this.trace}
        }
    }
    registerClass(SCADSyntaxError);

    // class SCADTypeError extends TypeError {
    //     constructor(message, entity) {
    //         super(message);
    //         this.location = new Location();
    //         this.entity = entity;
    //         this.file = file;
    //     }
    // }
    // registerClass(SCADTypeError);

    // class SCADSyntaxError extends SyntaxError {
    //     constructor(message, entity) {
    //         super(message);
    //         this.location = new Location();
    //         this.entity = entity;
    //         this.file = file;
    //     }
    // }
    // registerClass(SCADSyntaxError);
};
