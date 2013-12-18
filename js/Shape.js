function Shape() {
    // debugger;
    // var args = arguments;
    // // console.log(arguments.callee);
    // if(!(this instanceof arguments.callee)) {
    //     return new arguments.callee(args);
    // }

    if(arguments.length) {
        var args = arguments[0][0];
        for(property in args) {
            this[property] = args[property];
        }
    }
};
