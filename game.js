/* 
    For js13k 2022
    Theme: death
*/

// Functions for my little game engine thing
const log = (logType, msg) => {
    console.log(`[${logType}] ${msg}`);
}


// CONFIG
const fontStack = '"Comic Sans MS"';
var bullets = [];
var hitboxes = [];
var id = 0;
var pi = Math.PI;

class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        // get the width and height of the canvas from CSS
        this.trueWidth = this.canvas.offsetWidth;
        this.trueHeight = this.canvas.offsetHeight;
        this.scale = this.trueWidth / this.width;
        this.camera = {x: 0, y: 0};

        this.mousePos = {x: 0, y: 0};
        this.realMousePos = {x: 0, y: 0};

    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Mouse position crap
    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect(), // abs. size of element
          scaleX = this.canvas.width / rect.width,    // relationship bitmap vs. element for x
          scaleY = this.canvas.height / rect.height;  // relationship bitmap vs. element for y

        this.mousePos.x = (evt.clientX - rect.left) * scaleX;
        this.mousePos.y = (evt.clientY - rect.top) * scaleY;
      
        return {
          x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
          y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
      }

    translate(x, y) {
        this.ctx.translate(x, y);
    }

    rotate(angle) {
        this.ctx.rotate(angle);
    }

    // Drawing
    drawImg(img, x,y,w,h, direction=0, originx=x+w/2, originy=y+h/2) {
        this.ctx.save();
        this.ctx.translate(originx, originy);
        this.ctx.rotate(direction * pi/180);
        this.ctx.drawImage(img, -w/2, -h/2, w, h);
        this.ctx.restore();
    }

    drawImgRotated(img, x,y,w,h, direction=0, originx=x+w/2, originy=y+h/2) {
    }

    sliceImage(img, x, y, w, h, cropX, cropY, cropW, cropH, direction=0) {
        this.ctx.save();
        this.ctx.translate(x+w/2, y+h/2);
        this.ctx.rotate(direction * pi/180);
        this.ctx.drawImage(img, cropX, cropY, cropW, cropH, -w/2, -h/2, w, h);
        this.ctx.restore();
        // console.log(`${x}, ${y}, ${w}, ${h}, ${cropX}, ${cropY}, ${cropW}, ${cropH}`);
    }
    
    drawImage(img, x, y, w, h, direction=0) {
        // alias for drawImg
        this.drawImg(img, x, y, w, h, direction);
    }

    drawRect(x, y, w, h, color="white") {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x-this.camera.x, y-this.camera.y, w, h);
    }

    strokeRect(x, y, w, h, color) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x-this.camera.x, y-this.camera.y, w, h);
    }

    drawFont(string, x, y, color, align="start") {
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.fillText(string, x-this.camera.x, y-this.camera.y);
    }

    drawText(string, x, y, scaley, scalex, color, align="start", vAliign="top", ops={}) {

        // console.log(ops);

        // console.log(string)

        string = string.toUpperCase();
        let chars = string.split("");
        // console.log(chars);
        
        let charWidth = 7
        let strLength = (chars.length * charWidth - 1) * scalex; 

        let charHeight = 7
        let strHeight = (charHeight * scaley);

        switch(align) {
            case "start":
            case "left":
                x = x;
                break;
            case "center":
            case "middle":
                x = x - strLength/2;
                break;
            case "end":
            case "right":
                x = x - strLength;
                break;
        }
        switch(vAliign) {
            case "top":
                y = y;
                break;
            case "middle":
            case "center":
                y = y - strHeight/2;
                break;
            case "bottom":
                y = y - strHeight;
                break;
        }

        
        let charI = 0;
        let nextOffset = (7 * scalex);
        let lastWasFull = false;
        
        for (let char of chars) {
            
            this.ctx.fillStyle = color;
            let row = 0;
            let col = 0;
            // offset is the amount of pixels to offset the character by. you can calculate this by multiplying the current character (they're all the same size) by the scalex and scaley
            let offset = nextOffset;

            if (lastWasFull) {
                offset -= (0.5 * scalex);
                lastWasFull = false;
            }
            
            if(ops.shortFullStop) {
                if(char == ".") {
                    lastWasFull = true;
                }
            }

            char = fIndex[char];
            if (char == undefined) {
                // leave a blank space
            } else {
                for (let cRow in char) {
                    col = 0;
                    // for each pixel in the row
                    for (let c of char[cRow]) {
                        if (c == 1) {
                            this.ctx.fillRect((x + (col * scalex) + (charI * offset)) - this.camera.x,( y + (row * scaley)) - this.camera.y, scalex, scaley);

                        }
                        col++;
                    }
                    row++;
                }
            }

            charI++;
            // console.log(charI)

            nextOffset = (7 * scalex);

        }

    }

    setFont(fontStack, size="10") {
        this.ctx.font = `${size}px ${fontStack}`
    }

    drawLine(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1-this.camera.x, y1-this.camera.y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    // Camera stuff
    mvCamera(x, y, s) {
        this.camera.x += x;
        this.camera.y += y;
    }

    setCamera(x, y, s=1) {
        this.camera.x = x;
        this.camera.y = y;
    }

}

// Entity classes

class Entity {
    constructor(name, x, y, sprite=undefined) {
        this.name = name,
        this.x = x,
        this.y = y,
        this.sprite = sprite
    }
    step() {
        console.log(`${this.name} is stepping`);
        console.log(`${this.name} is at ${this.x}, ${this.y}`);
    }
    draw () {

    }
}

class Room {
    constructor(name) {
        this.id = id;
        id += 1;
        this.name = name;
        this.objects = [];
        this.hitboxes = [];
        this.background = [];
        this.w = canvas.width;
        this.h = canvas.height;
    }

    spawn(entity) {
        this.objects.push(entity)
    }

    step() {
        // step all objects in the room
        for (let obj of this.objects) {
            obj.step();
        }
    }

    draw() {
        // draw all objects in the room
        for (let obj of this.objects) {
            obj.draw();
        }
    }

    drawGUI() {

    }

    keyDown(key) {
        console.log(key);
    }
    keyPressed(key) {
        // console.log(key);
    }
    keyUp(key) {
        // console.log(key);
    }

    start() {

    }

}

// INIT CANVAS
var fIndex = fntINDEX;
var canvas = new Canvas('gameCanvas');
// check if the canvas is supported
if(!canvas.ctx) {
    alert("Your browser does not support the canvas element");
}
gameCtx = canvas.ctx;
canvas.fill("#1c1c1c");
canvas.setFont(fontStack);
gameCtx.imageSmoothingEnabled = false;
var gameStart = false;

canvas.drawText("Death By Hamster", canvas.width / 2, canvas.height / 2 - 40, 2, 2, "white", "middle");

// Load images
var images = {
    "mouse": {
        "ingame": "./assets/aimerthing.png",
        "cursor": "./cursor.png"
    },
    "background": {
        "floor": "./assets/flor.png",
    },
    "tileset": {
        "tiles":"./t.png",
    },
    "player": {
        "debugarrow": "./assets/arrow.png",
        "car": "./hamster.png",
        "gun": "./gun.png",
    }
};


let loadedImages = 0;
let totalImages = 0;

// count the total number of images to load
for (let key in images) {
    for (let subkey in images[key]) {
        totalImages++;
    }
}

canvas.drawText(`Loading...`, canvas.width / 2, canvas.height / 2 + 45, 1,1, "white", "center");

canvas.drawRect(canvas.width / 2 - 100, canvas.height / 2 + 30, 200, 50, "#1c1c1c");
canvas.drawText(`Loading images (${loadedImages} / ${totalImages})`, canvas.width / 2, canvas.height / 2 + 45, 1 ,1, "white", "center");


// after all images are loaded, and no errors occured, start the game
for (var key in images) {
    for (var subkey in images[key]) {
        
        // attempt to load the image
        var IMG = new Image();
        IMG.addEventListener('load', () => {
            loadedImages++;
            canvas.drawFont(`Loading images (${loadedImages} / ${totalImages})`, canvas.width / 2, canvas.height / 2 + 45, "white", "center");
            if (loadedImages == totalImages) {
                gameStart = true;
                canvas.drawFont(`Loading...`, canvas.width / 2, canvas.height / 2 + 45, "white", "center");
            }
        });
        IMG.addEventListener('error', () => {
            gameStart = false;
            canvas.drawRect(canvas.width / 2 - 100, canvas.height / 2 + 30, 200, 50, "#1c1c1c");
            canvas.drawFont(`Error loading image ${images[key][subkey]}`, canvas.width / 2, canvas.height / 2 + 45, "red", "center");
        } );
        IMG.src = images[key][subkey];

        // add the image to the images object
        images[key][subkey] = IMG;
        
        // draw the loading text by drawing a rectangle over the previous text, and drawing the new text
        canvas.drawRect(canvas.width / 2 - 100, canvas.height / 2 + 30, 200, 50, "#1c1c1c");
        canvas.drawFont(`Loading images (${loadedImages} / ${totalImages})`, canvas.width / 2, canvas.height / 2 + 45, "white", "center");
        
    }
}

hamsterRef = {
    "file": images.player.car,
    "nolights": {
        "x": 1,
        "y": 1,
        "w": 32,
        "h": 16,
    },
    "brake": {
        "x": 35,
        "y": 1,
        "w": 32,
        "h": 16,
    },
    "brakereverse": {
        "x": 1,
        "y": 20,
        "w": 32,
        "h": 16,
    },
    "reverse": {
        "x": 35,
        "y": 20,
        "w": 32,
        "h": 16,
    }
}

console.debug(images)
var targFPS = 60;
var frame = 0;

var rooms = [];

var menu = new Room("menu");

var testImage = new Image();
testImage.src = "./assets/arrow.png";

menu.drawGUI = () => {
    canvas.drawText("Death by Hamster", canvas.width/2, canvas.height/2-25, 2, 2, "white", "middle", "middle");
    canvas.drawText("Press any key to start", canvas.width/2, canvas.height/2+25, 1, 1, "white", "middle", "middle");
}
const nextRoom = () => {
    // move to the next room
    roomI++;
    if (roomI >= rooms.length) {
        roomI = 0;
    }
    cRoom = rooms[roomI];
}

const prevRoom = () => {
    // move to the previous room
    roomI--;
    if (roomI < 0) {
        roomI = rooms.length - 1;
    }
    cRoom = rooms[roomI];
}

const setRoom = (roomI) => {
    // set the current room to the given room
    cRoom = rooms[roomI];
}
menu.keyDown = (key) => {
    nextRoom();
}

var gameRoom = new Room("Game");
var player   = new Entity("Player", 0,0);
player.speed = 0;
player.maxSpeed = 5;
player.direction = 0;
player.accel = 1;
player.sprite = images.player.car;
console.debug(player.sprite);
player.crop = hamsterRef.nolights;
player.x = canvas.width/2;
player.y = canvas.height/2;
player.w = player.crop.w*2;
player.h = player.crop.h*2;
console.debug(`player.x: ${player.x}; player.y: ${player.y}; player.w: ${player.w}; player.h: ${player.h}`);

player.step = () => {
    // move in this.direction, which is an angle in degrees
    player.x += player.speed * Math.cos(player.direction * pi / 180);
    player.y += player.speed * Math.sin(player.direction * pi / 180);

    player.speed *= 0.009;
}

console.log(player);

player.draw = () => {
    // draw this.sprite at this.x, this.y
    canvas.sliceImage(player.sprite, player.x, player.y, player.w, player.h, player.crop.x, player.crop.y, player.crop.w, player.crop.h, player.direction); 
    // canvas.strokeRect(player.x, player.y, player.w, player.h, "white");

    let gun = images.player.gun;
    let gunOx = 25;
    let gunOy = -3;

    let carCx = player.x + player.w/2;
    let carCy = player.y + player.h/2;
    

    // get gunx and guny by moving backwards (gunOx and gunOy) from the center of the car in this.direction
    let gunx = carCx - gunOx * Math.cos(player.direction * pi / 180) - gunOy * Math.sin(player.direction * pi / 180);
    let guny = carCy - gunOx * Math.sin(player.direction * pi / 180) + gunOy * Math.cos(player.direction * pi / 180);

    // get the angle between the gun and the mouse
    let mouseAngle = Math.atan2(canvas.mousePos.y - guny-1, canvas.mousePos.x - gunx-19) * 180 / pi;

    // canvas.drawText(`Width${gun.width} Height${gun.height}`, gunx, guny-15, 1, 1, "green", "middle", "middle");
    canvas.drawImage(gun, gunx, guny, gun.width*2, gun.height*2, mouseAngle);

}   

gameRoom.spawn(player);

gameRoom.keyDown = (key) => {
    console.log(key);

    if (key == "ArrowUp" || key == "KeyW") {
        player.speed += player.accel*2;
        if (player.speed > player.maxSpeed) {
            player.speed = player.maxSpeed;
        }
    }
    if (key == "ArrowDown" || key == "KeyS") {
        player.speed -= player.accel*1.5;
        if (player.speed < -player.maxSpeed) {
            player.speed = -player.maxSpeed;
        }
    }
    if (key == "ArrowLeft" || key == "KeyA") {
        player.direction -= 2.5;
        if (player.direction < 0) {
            player.direction = 360;
        }
    }
    if (key == "ArrowRight" || key == "KeyD") {
        player.direction += 2.5;
        if (player.direction > 360) {
            player.direction = 0;
        }
    }
}


gameRoom.drawGUI = () => {
    // canvas.drawText("Test", cRoom.w/2, cRoom.h/2-25, 2, 2, "white", "middle", "middle");
}

rooms.push(menu);
rooms.push(gameRoom);
var roomI = 0;
var cRoom = rooms[roomI];

var keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
} );

var lastTime = 0;

var mse = {x: 0, y: 0};

canvas.canvas.addEventListener('mousemove', (e) => {
    mse = canvas.getMousePos(e);
} );

var gameLoop = setInterval(() => {
    canvas.trueWidth = canvas.canvas.offsetWidth;
    canvas.trueHeight = canvas.canvas.offsetHeight;
    canvas.scale = canvas.trueWidth / canvas.width;
    frame++;
    canvas.fill("#afafaf");

    for (let key in keysPressed) {
        if (keysPressed[key]) {
            cRoom.keyDown(key);
        }
    }
    
    cRoom.step();
    cRoom.draw();
    cRoom.drawGUI(); 

    /* BEDUG INFO */
    canvas.drawText(`FPS:${Math.round(1000 / (Date.now() - lastTime))}`, 10, 10, 1, 1, "white", "left", "top");
    switch (cRoom.name) {
        case "menu":
            canvas.drawText(`WidthHeight:${canvas.width} ${canvas.height}`, 10, 30, 1, 1, "white", "left", "top");
            canvas.drawText(`trueWidthHeight:${canvas.trueWidth} ${canvas.trueHeight}`, 10, 50, 1, 1, "white", "left", "top");
            canvas.drawText(`Scale:${canvas.scale}`, 10, 70, 1, 1, "white", "left", "top");
            break;
        case "Game":
            canvas.drawText(`PlayerXY:${player.x},${player.y}`, 10, 25, 1, 1, "white", "left", "top");
            // also show speed, rounded to 2 decimal places
            canvas.drawText(`Speed:${Math.round(player.speed*100)/100}`, 10, 40, 1, 1, "white", "left", "top");
            canvas.drawText(`Direction:${player.direction}`, 10, 50, 1, 1, "white", "left", "top");
            break;
    }

    switch (cRoom.name) {
        case "menu":
            canvas.ctx.drawImage(images.mouse.cursor, Math.round(mse.x), Math.round(mse.y), images.mouse.cursor.width*2, images.mouse.cursor.height*2);
            break;
        case "Game":
            canvas.ctx.drawImage(images.mouse.ingame, Math.round(mse.x)-16, Math.round(mse.y)-16, 32, 32);
            break;
    }
    lastTime = Date.now();


} , 1000/targFPS); // 60 fps
