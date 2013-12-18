function Workspace() {
    Scene.call(this, arguments[0]);

    this.ie = document.all ? true : false;
    this.objects = [];
    this.scenes = [];

    this.backgroundContext = this.background.getContext('2d');
    this.foregroundContext = this.container.getContext('2d');
    
    this.setHolderPosition();
    this.setDemoPosition();
    this.setMouseEvents();

    this.eventReactor.ie = this.ie;
    this.eventReactor.addEventListener('onTick', this.draw.bind(this));
}
Workspace.prototype = Object.create(Scene.prototype);
// Workspace.prototype.constructor = Workspace;

//TODO перерисовать при ресайзе окна
Workspace.prototype.drawBackground = function() {
    // console.log(this.id, this.X, this.Y, this.width, this.height);

    var start = Date.now();
    this.backgroundContext.clearRect(this.X, this.Y, this.width, this.height);
    this.backgroundContext.beginPath();
    this.backgroundContext.rect(this.X, this.Y, this.width, this.height);
    this.backgroundContext.fillStyle = '#f0f0e7';
    this.backgroundContext.fill();
    this.backgroundContext.restore();
    // console.log(this.id + ' render', Date.now() - start);

    for(var i in this.scenes) {
        this.scenes[i].draw();
    }
};

Workspace.prototype.draw = function() {
    this.foregroundContext.clearRect(this.X, this.Y, this.width, this.height);

    for(var i in this.scenes) {
        this.scenes[i].drawObjects();
    }

    this.drawObjects();
}

Workspace.prototype.setHolderPosition = function() {
    this.holder.X = this.X + 30;
    this.holder.Y = this.Y + 30;
    this.holder.width = this.width/2 - 30 - 30; // - отступ слева - отступ между блоками
    this.holder.height = this.height - 60;
    this.holder.fillStyle = 'white';

    this.holder.context = this.backgroundContext;

    //TODO избавиться от явной инициализации в этой функции
    this.addScene(this.holder);
};

Workspace.prototype.setDemoPosition = function() {
    this.demo.X = this.holder.X + this.holder.width + 30;
    this.demo.Y = this.Y + 30;
    this.demo.width = this.width/2 - 30; // - отступ слева - отступ между блоками
    this.demo.height = this.height - 60;
    this.demo.fillStyle = '#6DA3BD';

    this.demo.context = this.backgroundContext;

    //TODO избавиться от явной инициализации в этой функции
    this.addScene(this.demo);
};

Workspace.prototype.addBall = function(ball) {
    ball.context = this.foregroundContext;
    this.balls[this.balls.length] = ball;
};

Workspace.prototype.addScene = function(scene) {
    scene.context = this.backgroundContext;
    this.scenes[this.scenes.length] = scene;
};

Workspace.prototype.setMouseEvents = function() {
    //С IE 9+ можно использовать addEventListener

    // this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    // this.container.addEventListener('mousedown', this.mouseDownHandler.bind(this), false);
    // this.container.addEventListener('mouseup', this.mouseUpHandler.bind(this), false);
    // document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);

    this.container.addEventListener('mousedown', this.eventReactor.mouseDownHandler, false);
    this.container.addEventListener('mouseup', this.eventReactor.mouseUpHandler, false);


    this.eventReactor.addEventListener('onMouseDown', this.mouseDownHandler.bind(this));
    this.eventReactor.addEventListener('onMouseUp', this.mouseUpHandler.bind(this));
    this.eventReactor.addEventListener('onMouseMove', this.mouseMoveHandler.bind(this));
};

//Mouse events
Workspace.prototype.mouseDownHandler = function(e) {
    console.log('Mouse down', e);
    // this.boundMoveHandler = this.mouseMoveHandler.bind(this);
    // document.addEventListener('mousemove', this.mouseMoveHandler, false);

    // for (var i in this.balls) {
    //     var ball = this.balls[i];
    //     if(ball.clicked(e.X, e.Y)) {
    //         console.log(ball.id + " clicked");
    //         this.draggedBall = ball;
    //         return ball;
    //     }
    // }
    for(var i in this.scenes) {
        var scene = this.scenes[i];
        var object = scene.clicked(e);
        if(object) {
            object.dragged = true;
            this.dragged = object;
            return object;
        }
    }
};

Workspace.prototype.mouseUpHandler = function(e) {
    console.log('Mouse up', e);
    this.dragged.dragged = false;
    this.dragged = null;
    // document.removeEventListener('mousemove', this.mouseMoveHandler, false);
};

Workspace.prototype.mouseMoveHandler = function(e) {
    var dragged = this.dragged;

    if(dragged) {
        dragged.X = e.X;
        dragged.Y = e.Y;

        if(dragged.parent && !dragged.parent.containsObject(dragged)) {
            dragged.parent.releaseObject(dragged);
        }

        for(var i in this.scenes) {
            var scene = this.scenes[i];
            if(scene.containsObject(dragged)) {
                if(scene != dragged.parent) {
                    if(dragged.parent) {
                        dragged.parent.releaseObject(dragged);
                    }
                    scene.captureObject(dragged);
                }
                return scene;
            }
        }

        //Глобальная сцена в последнюю очередь, иначе в любом случае захватит объект
        if (!dragged.parent && this.containsObject(dragged)) {
            this.captureObject(dragged);
        }

        //dragged.parent.handleObjectDrag(dragged);

    }

    // console.log('Mouse moved', this.ie, mouseX, mouseY, e);
};
//End of mouse events section

Workspace.prototype.findResponsibleModel = function() {

};
