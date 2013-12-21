var el = function(id) {
    return document.getElementById(id);
};

var startDemo = function() {

    var reactor = new Reactor();

    var movingModel = new MovingModel({
        eventReactor: reactor,
        dampFactor: .98, // .98, //Коэффициент затухания
        springFactor: .5, //Коэффициент эластичности
        gravity: 2,
    });


    // var holder = new Scene({
    //     id: 'holder'
    // });



    // var demo = new Scene({
    //     id: 'demo',
    //     model: movingModel
    // });

    var workspaceContainer = el('workspace');
    workspaceContainer.setAttribute('width', document.body.clientWidth);
    workspaceContainer.setAttribute('height', document.body.clientHeight);

    var backgroundContainer = el('background');
    backgroundContainer.setAttribute('width', document.body.clientWidth);
    backgroundContainer.setAttribute('height', document.body.clientHeight);

    var workspace = new Workspace({
        id: 'Workspace',
        X: 0,
        Y: 0,
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        holder: holder,
        demo: demo,
        container: workspaceContainer,
        background: backgroundContainer,
        fps: 32,
        eventReactor: reactor
    });

    var holder = Shape.wake('Scene.holder', {
        id: 'holder'
    });

    workspace.holder = holder;
    workspace.setHolderPosition();

    var demo = Shape.wake('Scene.demo', {
        id: 'demo',
        model: movingModel
    });

    workspace.demo = demo;
    workspace.setDemoPosition();

    if(true || !holder.awaken) {
        var colorLetters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        //TODO просчитать наложение шариков
        for(var i = 0; i < 11; i++)
        {
            var bounce = .5 + (Math.random() * .5);
            var size = 35 - (bounce * 25);
            var color = "";

            for (var j = 0; j < 6; j++) {
                color += colorLetters[Math.round(Math.random()*14)];
            };

            var ball = Shape.wake('Ball.Ball' + i, {
                id: 'Ball' + i,
                size: size,
                fillStyle: '#' + color,
                X: workspace.holder.X + size + ((workspace.holder.width - size*2) * Math.random()),
                Y: workspace.holder.Y + size + ((workspace.holder.height - size*2) * Math.random()),
                bounce: bounce,
                dragged: false,
                context: workspace.foregroundContext
            });
            workspace.handleObjectCapture(ball);
        }
    }

    workspace.drawBackground();

    reactor.tick();

    window.reactor = reactor;
    window.workspace = workspace;
};

window.onload = startDemo;
