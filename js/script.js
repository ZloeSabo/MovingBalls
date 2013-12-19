var el = function(id) {
    return document.getElementById(id);
};

var startDemo = function() {

    var reactor = new Reactor();
    var dummyModel = new DummyModel();
    var movingModel = new MovingModel({
        eventReactor: reactor,
        dampFactor: .98, // .98,
        gravity: 2
    });


    var holder = new Scene({
        id: 'holder'
    });

    var demo = new Scene({
        id: 'demo',
        model: movingModel
    });

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

    var ball1 = new Ball({
        id: 'Ball1',
        size: 10,
        fillStyle: '#bb698f',
        X: workspace.holder.X + workspace.holder.width / 2,
        Y: workspace.holder.Y + workspace.holder.height / 2,
        bounce: 1,
        dragged: false,
        context: workspace.foregroundContext
    });

    holder.captureObject(ball1);

    // workspace.addBall(ball1);

    // for (var i = 0; i >= 10; i++) {
    //     workspace.addBall();
    // };

    workspace.drawBackground();

    // workspace.drawLoop();

    reactor.tick();
    // workspace.start();


    console.log(workspace, holder, demo);
    console.log(workspace == workspace,workspace == holder, holder == demo);

    window.reactor = reactor;
    window.workspace = workspace;
};

window.onload = startDemo;
