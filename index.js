// Declare some color constants
const colors = {
    red: "#BF616A",
    orange: "#D08770",
    yellow: "#EBCB8B",
    green: "#A3BE8C",
    blue: "#5E81AC",
    purple: "#B48EAD",
    grey: "#696969",
    darkgrey: "#5A5A5A",
    background: "#2E3440",
    foreground: "#ECEFF4",
};

// Declare sprite variables
let walls;
let ball;
let shadow;
let net;
let netsign;
let netbound2;
let holder;
let netwall;
let randomnumX;
let randomnumY;
let bounceOffFloor = 0;


// Initialize some params
let ballSize = 60;
let ballX = 300;
let ballY = 500;

let finalScore = 0;
let scoreSize = 32;

function preload() {
    basketBallImg = loadImage('Basketball.png');
    netImg = loadImage('net.png');
}

function setup() {
    new Canvas(windowWidth, windowHeight);
    world.gravity.y = 30;
    setupBounds();
    setupBall();
    setupFloor();
    setupNet();
    setUpRectangle();
    overlap();
    randomizeX();
    randomizeY();
    basketBallImg.resize(65, 65);
    netImg.resize(100, 100);
    soundFormats('mp3', 'ogg');
    swish = loadSound('swish.mp3');
    dribble = loadSound('dribble.mp3');
}


function draw() {
    clear();
    if (ball.mouse.pressing()) {
        ball.moveTowards(
            mouse.x + ball.mouse.x,
            mouse.y + ball.mouse.y,
            1 // full tracking
        );
        world.gravity.y = 0;
        net.overlaps(ball);
        netsign.overlaps(ball);
        mouseIsPressed = false;
        bounceOffFloor = 0;
    }
    if (mouse.released()){
        world.gravity.y = 30;
    }

    if (kb.presses('space')) {
        win.remove();
        finalScore = 0;
    }

    if (ball.collides(floor)) {
        if (bounceOffFloor > 8){
        }
        else {
            dribble.play();
        }
        bounceOffFloor+=1;
    }

    if (ball.collides(walls)) {
        dribble.play();
        bounceOffFloor = 0;
    }

    drawScore();
}

function drawScore() {
    textAlign(RIGHT, TOP);
    textSize(scoreSize);
    let wordWidth = textWidth(finalScore);
    fill(colors.grey);
    rectMode(CORNERS);
    rect(width, 0, width - wordWidth - 20, scoreSize + 20, 20);
    fill(colors.foreground);
    text(finalScore, width - 10, 10);


    if (ball.overlaps(netbound2)) {
        finalScore = finalScore + 10;
        swish.play();
        ball.remove();
        setupBall();
        net.remove();
        setUpRectangle();
        if (finalScore == 50) {
            win();
        }
    }
}

function randomizeX() {
    randomnumX = int(random(20, 400));
    return randomnumX;
}

function randomizeY() {
    randomnumY = int(random(300, 600));
    return randomnumY;
}

function setupBall() {
    ball = new Sprite();
    ball.addImage('basketball', basketBallImg);
    ball.diameter = ballSize;
    ball.bounciness = 0.75;
    ball.speed = 0;
    ball.pos = { x: randomizeX(), y: randomizeY() };
    ball.sleeping = true;
}

function overlap() {
    net.overlaps(ball);
}

function setupBounds() {
    walls = new Sprite(
        [
            [0, 0],
            [width, 0],
            [width, height],
            [0, height],
            [0, 1],
        ],
        "static"
    );
    walls.color = colors.background;
}

function setupFloor() {
    floor = new Sprite();
    floor.color = colors.grey;
    floor.y = windowHeight;
    floor.w = windowWidth;
    floor.h = windowHeight / 3;
    floor.collider = 'static';
}

function setUpRectangle() {
    net = new Sprite();
    net.addImage('net', netImg);
    net.color = colors.grey;
    net.w = 200;
    net.h = 10;
    net.pos = { x: windowWidth - 50, y: (windowHeight / 3) + 30 };
    net.collider = 'static';
}

function setupNet() {
    netsign = new Sprite();
    netsign.color = colors.yellow;
    netsign.w = 196;
    netsign.h = 1;
    netsign.pos = { x: windowWidth, y: windowHeight / 3 };
    netsign.collider = 'static';
    netsign.visible = false;

    netbound = new Sprite();
    netbound.pos = { x: windowWidth - 100, y: windowHeight / 2 + 60 };
    netbound.h = windowHeight / 2;
    netbound.w = 2;
    noStroke();
    netbound.visible = false;
    netbound.collider = 'static';

    netwall = new Sprite();
    netwall.pos = { x: windowWidth - 105, y: windowHeight / 2 + 40 };
    netwall.h = windowHeight / 2.5;
    netwall.w = 2;
    noStroke();
    netwall.visible = false;
    netwall.collider = 'static';

    netbound2 = new Sprite();
    netbound2.pos = { x: windowWidth, y: windowHeight / 2 + 30 };
    netbound2.h = 2;
    netbound2.w = 200;
    noStroke();
    netbound2.visible = false;
    netbound2.collider = 'static';
}

function win() {
    win = new Sprite();
    win.width = 700;
    win.height = 100;
    win.text = "You win! Click 'space' to play again.";
    win.collider = 'static';
    win.color = colors.foreground;
}