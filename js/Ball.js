function Ball() {
    Shape.call(this, arguments);
    this.velocityX = 0;
    this.velocityY = 0;
    this.prevX = 0;
    this.prevY = 0;
};

Ball.prototype = Object.create(Shape.prototype);
// Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
    // console.log(this.id, this.X, this.Y, this.size)

    var start = Date.now();
    this.context.fillStyle = this.fillStyle;
    this.context.beginPath();
    this.context.arc(this.X, this.Y, this.size, 0, Math.PI*2, true);
    this.context.closePath();
    this.context.fill();
    // console.log(this.id + ' render', Date.now() - start);

    this.context.restore();
};

Ball.prototype.clicked = function(mouseX, mouseY) {
    var dx = mouseX - this.X;
    var dy = mouseY - this.Y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    console.log(mouseX, mouseY, dx, dy, distance);

    return Math.floor(distance) <= this.size;
};
