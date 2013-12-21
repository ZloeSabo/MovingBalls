function Reactor() {
    this.events = {};

    this.addEventListener('onTick', this.tick.bind(this));

    this.fps = 60;

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.startCapturingMouse = this.startCapturingMouse.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.startCapturingMouse();

    window.addEventListener("beforeunload", this.windowCloseHandler.bind(this), false);
}

Reactor.prototype.registerEvent = function(eventName) {
    this.events[eventName] = {name: eventName, callbacks: []};
};

Reactor.prototype.dispatchEvent = function(eventName, eventArgs) {
    if (this.events[eventName] && this.events[eventName].callbacks) {
        for(var i in this.events[eventName].callbacks) {
            this.events[eventName].callbacks[i](eventArgs);
        }
    }
};

Reactor.prototype.addEventListener = function(eventName, callback) {
    if(typeof(this.events[eventName]) == 'undefined') this.registerEvent(eventName);
    return this.events[eventName].callbacks.push(callback) - 1;
};


//Timeout animationframe stuff
Reactor.prototype.requestAnimationFrame = function() {
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback, element){
                window.setTimeout(callback, 1000 / this.fps);
            };
};

Reactor.prototype.requestTimeout = function(fn, delay) {
    if( !window.requestAnimationFrame       && 
        !window.webkitRequestAnimationFrame && 
        !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
        !window.oRequestAnimationFrame      && 
        !window.msRequestAnimationFrame)
            return window.setTimeout(fn, delay).bind(this);
            
    var start = Date.now(),
        handle = new Object(),
        animationFunction = this.requestAnimationFrame(),
        fn = fn.bind(this),
        loop = function() {
            var current = Date.now(),
            delta = current - start;
        
            delta >= delay ? fn.call() : handle.value = animationFunction(loop);
        };
    ;

    handle.value = animationFunction(loop);

    return handle;
};
//End of timeout stuff

Reactor.prototype.tick = function() {
    this.requestTimeout(this.startTickLoop, 1000 / this.fps);
};

Reactor.prototype.startTickLoop = function() {
    this.dispatchEvent('onTick', {
        mouse: {
            X: this.mouseX,
            Y: this.mouseY
        }
    });
};

Reactor.prototype.startCapturingMouse = function(e) {
    document.addEventListener('mousemove', function(e) { 
        var mouseX = e.pageX;
        var mouseY = e.pageY;

        if(this.ie) {
            mouseX = e.clientX + document.body.scrollLeft;
            mouseY = e.clientY + document.body.scrollTop;
        } 
                    
        mouseX = Math.max(mouseX, 0);
        mouseY = Math.max(mouseY, 0);

        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.dispatchEvent('onMouseMove', {
            X:mouseX,
            Y:mouseY
        }); 
    }.bind(this), false);        
};

Reactor.prototype.mouseDownHandler = function() {
    this.dispatchEvent('onMouseDown', {
        X: this.mouseX,
        Y: this.mouseY
    });
};

Reactor.prototype.mouseUpHandler = function() {
    this.dispatchEvent('onMouseUp', {
        X: this.mouseX,
        Y: this.mouseY
    });
};

Reactor.prototype.windowCloseHandler = function() {
    this.dispatchEvent('onWindowClose');
};
