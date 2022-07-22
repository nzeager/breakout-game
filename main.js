// JavaScript code goes here
// Things to consider:
// difficulty mode where ball moves slower/faster, objects bigger/smaller, number of lives
// randomize where ball starts and initial angle
// add sound
// change colors
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// ball
let x = canvas.width/2;  // x coordinate of ball center
let y = canvas.height-30; // y coordinate of ball center
let dx = 2; // x rate of change
let dy = -2; // y rate of change
let ballRadius = 10;

// paddle
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;
let rightPressed = false; // right arrow pressed
let leftPressed = false; // left arrow pressed

// bricks
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
// call this function to create brick array
function brickArray() {
    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1};
        }
    }
}

// randomizing color of each row of bricks
const colors = ["#0095DD", "#f54245", "#42f54b", "#f542ec", "#f58d42"]; //colors to choose from
// next shuffle the array
const shuffledColors = colors.sort(() => 0.5 - Math.random()); //brick colors for each row

// score
let score = 0;

//lives
let lives = 3;

// drawing just the ball itself
function drawBall() {
ctx.beginPath();
ctx.arc(x, y, ballRadius, 0, Math.PI*2);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
}

// drawing the paddle itself
function drawPaddle() {
ctx.beginPath();
ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
}

//drawing the bricks
function drawBricks() {
for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
    if (bricks[c][r].status === 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = shuffledColors[r];
        ctx.fill();
        ctx.closePath();
    }
    }
}
}

// everything we want to draw (including ball)
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBall();
drawPaddle();
drawScore();
drawLives();
collisionDetection();
drawBricks();
x += dx;
y += dy;

// update x rate of change if ball hits left or right wall
if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) { 
    dx = -dx;
}
// update y rate of change if ball hits top wall or paddle
// Game Over if it hits the bottom wall
if(y + dy < ballRadius) { 
    dy = -dy;
} else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth){
    dy = -dy;
    } else {
    lives--;
    if (!lives) {
        alert("GAME OVER");
        document.location.reload();
    } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
    }
    }
}

// move the padde
if(rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
    }
} else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
    paddleX = 0;
    }
}
requestAnimationFrame(draw);
}

// functions will execute when keys are pressed/released
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
} else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
}
}

function keyUpHandler(e) {
if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
} else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
}
}

function mouseMoveHandler(e) {
let relativeX = e.clientX - canvas.offsetLeft;
if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
}
}

// check if the ball center is contained in a brick
function collisionDetection() {
for (let c=0; c<brickColumnCount; c++) {
    for (let r=0; r<brickRowCount; r++) {
    let b = bricks[c][r];
    if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
        dy = -dy;
        b.status = 0;
        score++;
        if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
        }
        }
    }
    }
}
}

// displays score
function drawScore() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Score: "+score, 8, 20);
}

// displays lives
function drawLives() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText(`Lives: ${lives}`, canvas.width-65, 20);
}

function difficulty() {
    // prompt for difficulty level
    let diffLvl = prompt("Choose a difficulty level. Enter e for easy, m for medium, h for hard, or c for customization options.");
    diffLvl = diffLvl.toLowerCase();
    //check for valid input
    while (diffLvl !== "e" && diffLvl !== "m" && diffLvl !== "h" && diffLvl !== "c"){
        diffLvl = prompt("Invalid option. Enter e for easy, m for medium, h for hard, or c for customization options.");
        diffLvl = diffLvl.toLowerCase();
    }

    switch(diffLvl) {
        case "e":
            brickRowCount = 1;
            dx = 1.5;
            dy = -1.5;
            paddleWidth = 100;
            lives = 5;
            break;
        case "m":
            brickRowCount = 3;
            dx = 2;
            dy = -2;
            paddleWidth = 75;
            lives = 3;
            break;
        case "h":
            brickRowCount = 5;
            dx = 3;
            dy = -3;
            paddleWidth = 50;
            lives = 1;
            break;
    }
}

difficulty();
brickArray()
draw();