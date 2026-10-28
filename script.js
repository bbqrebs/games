const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;


const player = {
    x:20,           //world x position
    y:20,
    width:32,
    height:32,
    dy:0,           //vertical velocity
    jumpForce:-14,  //negative = up
    gravity:.7,    //positive = pulling down
    grounded:true,   //standing on ground
};

const camera = {    //camera object to track the scroll offset
    x: 0
}

let isFalling = false;
let itemsCollected = 0;
let currentLevel = 0;
let worldWidth, floorY, platforms, exit, items, enemies; //level data

const keys = {right:false, left:false, space:false};


//level data
// const floorY = 350;
// const worldWidth = 1200;

// const platforms = [
//     { x:100, y:250, width:80, height:30},
//     { x:300, y: 150, width: 80, height: 30},
//     { x:550, y: 200, width: 100, height: 30}
// ];
// const exit = {x: 800, y: 100, ytop:50, ybottom:150, width:30, height:30, dir:1}; //{x;y;dir}


// const items = [
//     {x:1000, y:250, radius: 20, initialY: 250},
//     {x:500, y:150, radius: 20, initialY: 150}
// ]

// const enemy = {x:100, y:300, width: 50, height:30, xleft:100, xright:1000, dir: 1, intitialX:100, initialY:300}



document.addEventListener("keydown",(event) =>
{
    // If the game is won, press space to play again
    if (currentLevel >= levels.length) {
        if (event.key === ' ' || event.key === 'r' || event.key === 'R') {
            currentLevel = 0;
            loadLevel(currentLevel);
            gameLoop(); // Restart the game loop since it stopped!
        }
        return;
    }
    if (event.key === 'ArrowLeft') {
        keys.left = true;
    }
    if (event.key === 'ArrowRight') {
        keys.right = true;
    }
    if (event.key === ' ' && player.grounded) {
        player.dy = player.jumpForce;
        player.grounded = false;
    }
});

document.addEventListener("keyup",(event) =>
{
    if (event.key === 'ArrowLeft') {
        keys.left = false;
    }
    if (event.key === 'ArrowRight') {
        keys.right = false;
    }
    
});

function loadLevel(index){
    const level = levels[index]();

    worldWidth = level.worldWidth;
    floorY = level.floorY;
    platforms = level.platforms;
    exit = level.exit;
    items = level.items;
    enemies = level.enemies;

    // Reset player & progress
    player.x = 20;
    player.y = 20;
    player.dy = 0;
    isFalling = false;
    itemsCollected = 0;
}

function isColliding(rect1, rect2) {
    // Find the edges of Rectangle 1
    const r1Left   = rect1.x;
    const r1Right  = rect1.x + rect1.width;
    const r1Top    = rect1.y;
    const r1Bottom = rect1.y + rect1.height;

    // Find the edges of Rectangle 2
    const r2Left   = rect2.x;
    const r2Right  = rect2.x + rect2.width;
    const r2Top    = rect2.y;
    const r2Bottom = rect2.y + rect2.height;

    // Check for overlap on both horizontal (X) and vertical (Y) axes
    const horizontalOverlap = r1Right > r2Left && r1Left < r2Right;
    const verticalOverlap   = r1Bottom > r2Top && r1Top < r2Bottom;

    // A collision only happens if they overlap on BOTH axes at the same time
    return horizontalOverlap && verticalOverlap;
}

function updateX() {
    let dx = 0;
    if (keys.left && player.x > 0) dx = -5;
    if (keys.right && player.x < worldWidth-player.width) dx = 5;

    // Apply X movement
    player.x += dx;

    // Resolve X collisions 
    for (const platform of platforms) 
        if (isColliding(player, platform)) {
            if (dx > 0) {
                // Moving right, hit left side of platform
                player.x = platform.x - player.width;
            } else if (dx < 0) {
                // Moving left, hit right side of platform
                player.x = platform.x + platform.width;
            }
        }
    }


function updateY() {
    player.dy += player.gravity; // Apply gravity
    player.y += player.dy;       // Apply vertical movement

    let landed = false;

    // Check floor collision
    if (player.y + player.height >= floorY) {
        player.y = floorY - player.height;
        player.dy = 0;
        landed = true;
    }

    // Check obstacle collisions vertically
    for (const platform of platforms) {
        if (isColliding(player, platform)) {
            if (player.dy > 0) {
                // Falling down onto an platform
                player.y = platform.y - player.height;
                player.dy = 0;
                landed = true;
            } else if (player.dy < 0) {
                // Jumping up into an playform
                player.y = platform.y + platform.height;
                player.dy = 0; // Stop upward velocity (hit head)
            }
        }
    }

    player.grounded = landed;
}


function drawPlatforms() {
    for (const platform of platforms){
        ctx.fillStyle = '#12b0db';
        ctx.fillRect(platform.x-camera.x,platform.y,platform.width,platform.height)
    }
}

function drawExit() {
    if (exit.dir == 1){
        exit.y++;
        if (exit.y >= exit.ybottom) {
            exit.dir = -1;
        }
    } else if (exit.dir == -1){
        exit.y--;
        if(exit.y <= exit.ytop) {
            exit.dir = 1;
        }
    }
    ctx.fillStyle = '#6dc81e';
    ctx.fillRect(exit.x-camera.x,exit.y,exit.width,exit.height);
    
}

function updateItems(){
    let nItems = items.length;

    for (const item of items){
        ctx.beginPath()
        ctx.arc(item.x-camera.x,item.y,item.radius,0,2*Math.PI)
        ctx.fillStyle = 'rgb(255, 157, 0)'
        ctx.fill()
    }

    for (const item of items){
        if (isColliding(player,{x:(item.x-item.radius),y:(item.y-item.radius),width:2*item.radius,height:2*item.radius})){
            //we're using the rectangle collision function but our items are circles
            itemsCollected++;
            item.y = -100;
        }
    }
    //draw empty item
    for (let i = 0; i < nItems; i++){
        ctx.beginPath()
        ctx.arc(30*(i+1),380,10,0,2*Math.PI)
        ctx.strokeStyle = 'rgb(255, 157, 0)'
        ctx.stroke()
    }

    //draw collected items
    for (let i = 0; i < itemsCollected; i++){
        ctx.beginPath()
        ctx.arc(30*(i+1),380,10,0,2*Math.PI)
        ctx.fillStyle = 'rgb(255, 157, 0)'
        ctx.fill()
    }
 
    

}

function updateEnemies(){
    for (const enemy of enemies){
        ctx.fillStyle = '#888';
        ctx.fillRect(enemy.x-camera.x,enemy.y,enemy.width,enemy.height)

        if (enemy.dir == 1){
            enemy.x++;
            if (enemy.x >= enemy.xright) {
                enemy.dir = -1;
            }
        } else if (enemy.dir == -1){
            enemy.x--;
            if(enemy.x <= enemy.xleft) {
                enemy.dir = 1;
            }
        }
    }

}

function updatePlayerFall(){
    if (isFalling) {
        player.dy += player.gravity; // Increase speed over time
        player.y += player.dy; // Move player down


        // Once the player goes completely off the bottom of the screen
        if (player.y > canvas.height + player.height) {
            isFalling = false;
            loadLevel(currentLevel); // Now reset the level
        }
    }
}




function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    console.log(currentLevel);
    
    
    // Run physics updates
    if (!isFalling){
        updateX();
        updateY();
    }
    // Camera Logic
    //keep player 150 pixels from left
    camera.x = player.x-150;
    //Don't let camera scroll past the left edge (0) or the right edge of the world
    if (camera.x < 0){
        camera.x=0;
    }
    if (camera.x > worldWidth-canvasWidth){
        camera.x=worldWidth-canvasWidth;
    }
    //TODO: draw background
    //draw floor
    ctx.fillStyle = 'black';
    ctx.fillRect(0-camera.x,floorY,worldWidth,canvasHeight-floorY)

    //draw platforms
    drawPlatforms();

    //draw moving exit
    drawExit();
    
    //update items
    updateItems();
    
    //update enemy
    updateEnemies();

    //animate fall and restart level if colliding with enemy
    for(const enemy of enemies){
        if(isColliding(player,enemy) && !isFalling){
            isFalling = true; //start falling animation
            player.dy = -12  //give player a little hop 
        }
    }   
    
    //update falling animation
    updatePlayerFall();

    //exit logic
    if (isColliding(player,exit) && itemsCollected == items.length){
        currentLevel++;
        if (currentLevel == levels.length){
            //end game screen
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0,canvasWidth,canvasHeight);
            ctx.font = 'bold 30px Courier';
            ctx.fillStyle = 'white';
            ctx.fillText('YOU WIN!',220,150);
            ctx.font = 'bold 20px Courier';
            ctx.fillText('Press SPACE or R to play again',120,200);
            return;
        }   
        else loadLevel(currentLevel);
        
    }

    // Draw player
    ctx.fillStyle='red';
    ctx.fillRect(player.x-camera.x,player.y,player.width,player.height);

    requestAnimationFrame(gameLoop);
}

loadLevel(currentLevel);
gameLoop();