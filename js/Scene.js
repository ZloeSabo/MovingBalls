function Scene() {
    Shape.call(this, arguments);

    this.objects = {};
    if(this.model) {
        //this.model.objects = this.objects;
        this.model.scene = this;
    }
}

Scene.prototype = Object.create(Shape.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.draw = function() {
    // console.log(this.id, this.X, this.Y, this.width, this.height);

    var start = Date.now();
    this.context.beginPath();
    this.context.rect(this.X, this.Y, this.width, this.height);
    this.context.fillStyle = this.fillStyle;
    this.context.fill();
    // console.log(this.id + ' render', Date.now() - start);

    this.context.restore();
};

Scene.prototype.drawObjects = function() {
    for(var i in this.objects) {
        this.objects[i].draw();
    }
};

Scene.prototype.containsObject = function(object) {
    //TODO учитывать размер объекта
    return this.X <= object.X && (this.X + this.width) >= object.X
        && this.Y <= object.Y && (this.Y + this.height) >= object.Y;
};

Scene.prototype.captureObject = function(object) {
    this.objects[object.id] = object;
    object.parent = this;
    console.log(object.id + ' captured by ' + this.id);
};

Scene.prototype.releaseObject = function(object) {
    delete this.objects[object.id];
    object.parent = null;
    console.log(object.id + ' released by ' + this.id);
};

Scene.prototype.clicked = function(ev) {
    for (var i in this.objects) {
        var object = this.objects[i];
        if(object.clicked(ev.X, ev.Y)) {
            return object;
        }
    }

    return null;
};


