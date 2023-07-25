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
let doodleY = boardHeight- (35 + doodleHeight);
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
let platformCount=7;

let score=0;
let maxScore=0
let gameOver=false;
let deltaTime=0;

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
    if(gameOver){
        return;
    }

    // Calculate delta time
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastFrameTime) / 16;

    // Draw game state
    context.clearRect(0, 0, boardWidth, boardHeight);

    //doodler render
    velY += gravity*deltaTime;
    doodler.y+=velY*deltaTime;
    if(doodler.y > boardHeight){
        gameOver=true;
    }
    doodlerRender(deltaTime);

    //platform render
    for(let i = 0; i<platformArray.length;i++){
        let platform=platformArray[i];
        if(velY<0 && doodler.y < boardHeight*3/5){
            platform.y -= initialVelY*deltaTime;
        }
        //jump
        if(detectCollision(doodler,platform) && velY>=0){
            velY=initialVelY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    //new platform
    while(platformArray.length>0 && platformArray[0].y >= boardHeight){
        platformArray.shift();
        newPlatform();
        score+=147;
    }

    //score
    context.fillStyle="black";
    context.font="16px sans-serif"
    context.fillText("Score: "+score,5,20)

    if(gameOver){
        context.fillText("Game over: Press 'space' to restart", boardWidth/7, boardHeight*7/8)
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
    else if(e.code=="Space" && gameOver){
        doodler = {
            img: doodleRightImg,
            x: doodleX,
            y: doodleY,
            width: doodleWidth,
            height: doodleHeight
        };
        velX=0;
        velY=initialVelY;
        score=0;
        gameOver=false;
        placePlatforms();
        requestAnimationFrame(update);
    }
}

function doodlerRender(deltaTime){
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
        y: boardHeight-30,
        width:platformWidth,
        height:platformHeight
    }

    platformArray.push(platform);

    for(let i=0; i<platformCount; i++){
        let randomX = Math.floor(Math.random()*boardWidth*3/4);
        let gap=Math.floor(Math.random()*10);
        platform={
            img: platformImg,
            x: randomX,
            y: boardHeight - (70+gap)*i - 150 ,
            width:platformWidth,
            height:platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatform(){
    let randomX = Math.floor(Math.random()*boardWidth*3/4);
    let gap=Math.floor(Math.random()*10);
    platform={
        img: platformImg,
        x: randomX,
        y: -platformHeight + gap,
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
