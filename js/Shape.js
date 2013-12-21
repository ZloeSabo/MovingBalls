function Shape() {

    // this.wake = function(serializeKey, defaults, objectWakeCallback) {

    //     var awaken = null;
    //     var type = serializeKey.split('.')[0];

    //     if(localStorage[serializeKey]) {
    //         var properties = JSON.parse(serializeKey);
    //         for (var i in properties) {
    //             var property = properties[i];
    //             defaults[i] = property; 
    //         };
    //         defaults['id'] = serializeKey.split('.')[1];
    //     }

    //     awaken = new window[type](defaults);

    //     if(localStorage[serializeKey + '.objects']) {
    //         var objectKeys = JSON.parse(localStorage[serializeKey + '.objects']);
    //         for(var i in objectKeys) {
    //             var key = objectKeys[i];
    //             var properties = JSON.parse(key);

    //             objectWakeCallback.apply(this, [key, properties]);
    //         }
    //     }

    //     return awaken;
    // };


    if(arguments.length) {
        var args = arguments[0][0];
        for(property in args) {
            this[property] = args[property];
        }
    }

};

Shape.prototype.sleep = function() {
    var key = this.constructor.name;
    var id = this.id || key;

    var serializeKey = key + '.' + id;

    var currentObjectsString = localStorage[key] || "[]";
    var currentObjectsOfType = JSON.parse(currentObjectsString);
    if(currentObjectsOfType.indexOf(id) < 0) {
        currentObjectsOfType[currentObjectsOfType.length] = id;
        localStorage[key] = JSON.stringify(currentObjectsOfType);
    } 

    var serialized = {};

    if(this.sleepProperties) {
        for(var i in this.sleepProperties) {
            var property = this.sleepProperties[i]
            serialized[property] = this[property];
        }
    } 

    localStorage[serializeKey] = JSON.stringify(serialized);


    if(this.objects) {
        var objectKeys = [];
        for(var i in this.objects) {
            objectKeys[objectKeys.length] = this.objects[i].sleep();
        }

        localStorage[serializeKey + '.objects'] = JSON.stringify(objectKeys);
    }

    return serializeKey;
};

Shape.wake = function(serializeKey, defaults, beforeObjectWakeCallback) {

    // debugger;
    defaults = defaults || {};
    beforeObjectWakeCallback = beforeObjectWakeCallback || Shape.noop;

    var awaken = null;
    var type = serializeKey.split('.')[0];
    defaults.id = serializeKey.split('.')[1];


    if(localStorage[serializeKey]) {
        var properties = JSON.parse(localStorage[serializeKey]);
        for (var i in properties) {
            var property = properties[i];
            defaults[i] = property; 
        };
        defaults.awaken = true;
        console.log(defaults.id + " waken");
    }

    awaken = new window[type](defaults);

    if(localStorage[serializeKey + '.objects']) {
        awaken.objects = {};
        var objectKeys = JSON.parse(localStorage[serializeKey + '.objects']);
        for(var i in objectKeys) {
            var key = objectKeys[i];
            var objectId = key.split('.')[1];
            var properties = JSON.parse(localStorage[key]);

            properties = beforeObjectWakeCallback.apply(this, [key, properties]);

            // awaken.objects[objectId] = Shape.wake(key)
        }
    }

    return awaken;
};

Shape.noop = function() {};
