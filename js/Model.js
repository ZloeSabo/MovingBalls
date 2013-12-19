function DummyModel() {
    if(arguments.length) {
        var args = arguments[0][0];
        for(property in args) {
            this[property] = args[property];
        }
    }
};

DummyModel.prototype.handleTick = function() {};
DummyModel.prototype.handleDrag = function() {};

function MovingModel() {
    Shape.call(this, arguments);

    this.eventReactor.addEventListener('onTick', this.handleTick.bind(this));
};

MovingModel.prototype = Object.create(DummyModel.prototype);
MovingModel.prototype.update = function() {
    var objects = this.scene.objects;

    for(var i in objects) {
        var object = objects[i];
        if(!object.dragged) {
            object.X += object.velocityX;
            object.Y += object.velocityY;

            this.handleHorizontalSceneCollision(object);
            this.handleVerticalSceneCollision(object);
            
            if ((object.velocityX + object.velocityY) > 1) {
            object.velocityX = object.velocityX * this.dampFactor;
            object.velocityY = object.velocityY * this.dampFactor + this.gravity;
            }
            // console.log(object.id, object.X, object.Y, object.velocityX, object.velocityY);
        } else {
            object.velocityX = object.X - object.prevX;
            object.velocityY = object.Y - object.prevY;

            object.prevX = object.X;
            object.prevY = object.Y;

            // console.log(object.velocityX, object.velocityY);
            // console.log(object.prevX, object.X, object.prevY, object.Y);

        }


        
    }
}

//Обработка столкновений с верхней и нижней границами сцены
MovingModel.prototype.handleHorizontalSceneCollision = function(object) {
    if ((object.X + object.size) > this.scene.X + this.scene.width) {
        object.X = this.scene.X + this.scene.width - object.size;
        object.velocityX = - object.velocityX * object.bounce;
    } else if((object.X - object.size) < this.scene.X) {
        object.X = this.scene.X + object.size;
        object.velocityX = -object.velocityX * object.bounce;
    }
};

//Обработка столкновений с правой и левой границами сцены
MovingModel.prototype.handleVerticalSceneCollision = function(object) {
    if ((object.Y + object.size) > this.scene.Y + this.scene.height) {
        object.Y = this.scene.Y + this.scene.height - object.size;
        object.velocityY = -object.velocityY * object.bounce;
    } else if((object.Y - object.size) < this.scene.Y) {
        object.Y = this.scene.Y + object.size;
        object.velocityY = -object.velocityY * object.bounce;
    }
};

MovingModel.prototype.handleObjectCollisions = function() {

};

MovingModel.prototype.handleTick = function() {
    this.update();
};

