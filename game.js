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
var id = 0

class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.realWidth = 640;
        this.realHeight = 480;
        this.camera = {x: 0, y: 0};

        this.mousePos = {x: 0, y: 0};
        this.realMousePos = {x: 0, y: 0};

    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Mouse position crap
    getMousePos(e) {
        let rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = ((e.clientX - rect.left) / 2) + this.camera.x;
        this.mousePos.y = ((e.clientY - rect.top) /2) + this.camera.y;

        document.getElementById('mousePos').innerHTML = `${this.mousePos.x}, ${this.mousePos.y}`;

        return this.mousePos;
    }

    // Drawing
    drawImg(img, x, y, w, h) {
        this.ctx.drawImage(img, x-this.camera.x, y-this.camera.y, w, h);
    }
    drawImage(img, x, y, w, h) {
        this.drawImg(img, x, y, w, h);
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

    setFont(fontStack=fontStack, size="10") {
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
        for (let object of this.objects) {
            object.step();
        }
    }

    draw() {
        // draws stuff onto the screen
        for (let object of this.objects) {
            object.draw()
        }
    }

    drawGUI() {

    }

    keyDown(key) {
        console.log(key);
    }
    keyPressed(key) {
        console.log(key);
    }
    keyUp(key) {
        console.log(key);
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
    },
    "background": {
        "floor": "./assets/flor.png",
    },
    "tileset": {
        "tiles":"./t.png",
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
var targFPS = 60;
var frame = 0;

var rooms = [];

rooms.push(new Room("Menu"));

var cRoom = rooms[0];
cRoom.drawGUI = () => {
    canvas.drawText("Death by Hamster", canvas.width/2, canvas.height/2-25, 2, 2, "white", "middle", "middle");
}
cRoom.keyDown = (key) => {
    // go to the next room
    cRoom = rooms[1];
}

var gameRoom = new Room("Game");
var player   = new Entity("Player", 0,0);

player.step = () => {
}

gameRoom.spawn(player);
gameRoom.drawGUI = () => {
    canvas.drawText("Test", canvas.width/2, canvas.height/2-25, 2, 2, "white", "middle", "middle");
}
rooms.push(gameRoom);

var keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
} );

var gameLoop = setInterval(() => {
    frame++;
    canvas.fill("black");

    for (let key in keysPressed) {
        if (keysPressed[key]) {
            cRoom.keyDown(key);
        }
    }

    
    cRoom.step();
    cRoom.draw();
    cRoom.drawGUI();

    canvas.drawText(`Frame:${frame}`, 5,5,1,1,"red")

} , 1000/targFPS); // 60 fps
