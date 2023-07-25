let fps = 60;
let interval = 1000 / fps;
let lastTime = performance.now();
let frameRateDisplay = document.createElement("div");
document.body.appendChild(frameRateDisplay);
let frameCount = 0;
let lastFrameTime = performance.now();

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
let velY=0;
let initialVelY=-8;
let gravity=0.4;

let doodler = {
    img: doodleRightImg,
    x: doodleX,
    y: doodleY,
    width: doodleWidth,
    height: doodleHeight
};

let platformArray=[];
let platformWidth=60;
let platformHeight=18;
let platformImg=new Image();
platformImg.src="./Assets/platform.png";

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    velY=initialVelY;

    placePlatforms();

    requestAnimationFrame(update);
    document.addEventListener("keydown", controls);
};

function update() {
    // Calculate delta time
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 16;

    // Draw game state
    context.clearRect(0, 0, boardWidth, boardHeight);

    velY += gravity*deltaTime;
    doodler.y+=velY*deltaTime;
    doodlerMove(deltaTime);

    for(let i = 0; i<platformArray.length;i++){
        let platform=platformArray[i];
        if(detectCollision(doodler,platform)){
            velY=initialVelY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    showfps(currentTime);
    requestAnimationFrame(update);
}

function controls(e){
    if(e.code=="ArrowRight" || e.code == "KeyD"){
        velX=4;
        doodler.img=doodleRightImg;
    }
    else if(e.code=="ArrowLeft" || e.code=="KeyA"){
        velX=-4;
        doodler.img=doodleLeftImg;
    }
}

function doodlerMove(deltaTime){
    doodler.x +=velX*deltaTime;
    if(doodler.x > boardWidth){
        doodler.x=0-doodler.width/2;
    }
    else if(doodler.x + doodler.width < 0){
        doodler.x=boardWidth-doodleWidth/2;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
}

function placePlatforms(){
    platformArray=[];

    let platform={
        img: platformImg,
        x: boardWidth/2,
        y:boardHeight-50,
        width:platformWidth,
        height:platformHeight
    }

    platformArray.push(platform);

    platform={
        img: platformImg,
        x: boardWidth/2,
        y:boardHeight-150,
        width:platformWidth,
        height:platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a,b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

// Update frame rate display
function showfps(currentTime){
    frameCount++;
    let frameRate = frameCount / ((currentTime - lastFrameTime) / 1000);
    frameRateDisplay.textContent = `FPS: ${frameRate.toFixed(1)}`;
    frameCount = 0;
    lastFrameTime = currentTime;
}
