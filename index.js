let fps = 60;
let interval = 1000 / fps;
let lastTime = performance.now();

let board;
let boardWidth = 380;
let boardHeight = 640;
let context;

let doodleWidth = 46;
let doodleHeight = 46;
let doodleX = boardWidth / 2 - doodleWidth / 2;
let doodleY = boardHeight * 7 / 8 - doodleHeight;
let doodleRightImg = new Image();
let doodleLeftImg = new Image();
doodleLeftImg.src = "./Assets/doodler-left.png";
doodleRightImg.src = "./Assets/doodler-right.png";

let velX=0;

let doodler = {
    img: doodleRightImg,
    x: doodleX,
    y: doodleY,
    width: doodleWidth,
    height: doodleHeight
};
// Frame rate display
let frameRateDisplay = document.createElement("div");
document.body.appendChild(frameRateDisplay);

// Frame rate counter
let frameCount = 0;
let lastFrameTime = performance.now();


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
};

function update() {
    // Calculate delta time
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 16;

    // Draw game state
    context.clearRect(0, 0, boardWidth, boardHeight);

    doodler.x +=velX*deltaTime;
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);



    showfps(currentTime);
    requestAnimationFrame(update);
}

function moveDoodler(e){
    if(e.code=="ArrowRight" || e.code == "KeyD"){
        velX=4;
        doodler.img=doodleRightImg;
    }
    else if(e.code=="ArrowLeft" || e.code=="KeyA"){
        velX=-4;
        doodler.img=doodleLeftImg;
    }
}


// Update frame rate display
function showfps(currentTime){
    frameCount++;
    let frameRate = frameCount / ((currentTime - lastFrameTime) / 1000);
    frameRateDisplay.textContent = `FPS: ${frameRate.toFixed(1)}`;
    frameCount = 0;
    lastFrameTime = currentTime;
}
