/* 
    For js13k 2022
    Theme: death
*/

// CONFIG
const fontStack = '"Comic Sans MS"';
let id = 0;
const pi = Math.PI;
let o = {showFPS:true}
gPar = (key) => {

    // Address of the current window
    let address = window.location.search

    // Returns a URLSearchParams object instance
    let parameterList = new URLSearchParams(address)

    // Returning the respected value associated
    // with the provided key
    return parameterList.get(key)
}

const customLv = gPar("lv");

class Canvas {
    constructor(id) {
        this.c = document.getElementById(id);
        this.ctx = this.c.getContext('2d');
        this.w = this.c.width;
        this.h = this.c.height;
        // get the width and height of the canvas from CSS
        this.tW = this.c.offsetWidth;
        this.tH = this.c.offsetHeight;
        this.camera = {x: 0, y: 0};

        this.mousePos = {x: 0, y: 0};

    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    // Mouse position crap
    getMousePos(evt) {
        const rect = this.c.getBoundingClientRect(), // abs. size of element
            scaleX = this.c.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = this.c.height / rect.height;  // relationship bitmap vs. element for y

        this.mousePos.x = ((evt.clientX - rect.left) * scaleX) + this.camera.x;
        this.mousePos.y = ((evt.clientY - rect.top) * scaleY) + this.camera.y;
    
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
        this.ctx.translate(originx-this.camera.x, originy-this.camera.y);
        this.ctx.rotate(direction * pi/180);
        this.ctx.drawImage(img, (-w/2), -h/2, w, h);
        this.ctx.restore();
    }
    sliceImage(img, x, y, w, h, cropX, cropY, cropW, cropH, direction=0) {
        this.ctx.save();
        this.ctx.translate((x+w/2)-this.camera.x, (y+h/2)-this.camera.y);
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

    dT(string, x, y, scaley, scalex, color, align="start", vAliign="top", ops={}) {

        // console.log(ops);

        // console.log(string)

        string = string.toUpperCase();
        let chars = string.split("");
        // console.log(chars);
        
        let charWidth = 7
        let charOff = 0;
        // check if there's an odd number of chars
        if (chars.length % 2 == 1) {
             charOff = 1
        }
        let strLength = (chars.length * charWidth - charOff) * scalex; 

        let charHeight = 7
        let strHeight = (charHeight * scaley);
        if (strHeight % 2 == 1) {
            strHeight += 1;
        }

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

            char = fI[char];
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

        return {
            "w": strLength
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
    mvCamera(x, y) {
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
    intersects(other) {
        return (this.x < other.x + other.w && this.x + this.w > other.x && this.y < other.y + other.h && this.y + this.h > other.y)
    }
}

class Room {
    constructor(name) {
        this.id = id;
        id += 1;
        this.name = name;
        this.objects = [];
        this.background = "#151f1f";
        this.w = c.w;
        this.h = c.h;
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
        // console.log(key);
    }
    keyHeld(key) {
        // console.log(key);
    }
    click(x, y) {
        // console.log(x, y);
    }
    mHeld(x,y){

    }

    start() {

    }

}

// INIT CANVAS
var fI = fntINDEX; // in letters.js
var c = new Canvas('gameCanvas');
// check if the canvas is supported
if(!c.ctx) {
    alert("Your browser does not support the canvas element");
}
gameCtx = c.ctx;
c.fill("#151f1f");
c.setFont(fontStack);
gameCtx.imageSmoothingEnabled = false;
var gameStart = false;

c.dT("Death By Hamster", c.w / 2, c.h / 2 - 40, 2, 2, "white", "middle");

// Load images
var images = {
    "mouse": {
        "ingame": "./aimerthing.png",
        "cursor": "./cursor.png"
    },
    "level": {
        "tileset": "./t.png",
        "human": "./human.png"
    },
    "player": {
        "car": "./hamster.png",
        "gun": "./gun.png",
    },
    "ui": {
        "a": "./arw.png" // arrow
    }
};

var loader = new Room("loader");
var loadingText = "Loading...";
var loadingError = 0;
loader.drawGUI = () => {
    c.dT(loadingText, c.w / 2, c.h / 2, 2, 2, "white", "middle");
    if (loadingError) {
        c.dT(loadingErrorText, c.w / 2, c.h / 2 + 20, 1, 1, "red", "middle");
    }
}
var rooms = [];

var loadedImages = 0;
var totalImages = 0;

// count the total number of images to load
for (let key in images) {
    for (let subkey in images[key]) {
        totalImages++;
    }
}

loadingText = `Loading...`;

loadingText = `Loading images (${loadedImages} / ${totalImages})`


// after all images are loaded, and no errors occured, start the game
for (var key in images) {
    for (var subkey in images[key]) {
        
        // attempt to load the image
        var IMG = new Image();
        IMG.addEventListener('load', () => {
            loadedImages++;
            loadingText = `Loading images (${loadedImages} / ${totalImages})`
            if (loadedImages == totalImages) {
                loader.step = () => {
                    cRoom = rooms[1];
                }
                loadingText = "Loaded! Please wait...";
            }
        });
        IMG.addEventListener('error', (e) => {
            loadingError = 1;
            loadingErrorText = `Error loading image ${e.target.src}`;
        } );
        IMG.src = images[key][subkey];

        // add the image to the images object
        images[key][subkey] = IMG;
        
        // draw the loading text by drawing a rectangle over the previous text, and drawing the new text
        loadingText = `Loading images (${loadedImages} / ${totalImages})`
        
    }
}

var levels = [
    {
        "name": "Tutorial",
        "data": "[[1,1,2],[1,1,3],[5,1,4],[1,1,1],[2,0,3],[2,0,2],[2,0,1],[4,0,0],[5,1,0],[5,2,0],[5,3,0],[5,4,0],[5,6,0],[5,5,0],[5,7,0],[6,8,0],[1,2,3],[1,3,3],[1,4,3],[1,6,3],[1,7,3],[1,7,2],[1,7,1],[1,6,1],[1,5,2],[1,6,2],[1,5,3],[1,5,1],[1,4,1],[1,4,2],[9,2,2],[1,3,2],[1,3,1],[1,2,1],[7,0,4],[5,2,4],[1,8,3],[1,8,4],[1,7,4],[1,9,4],[1,8,5],[1,9,5],[1,7,5],[1,9,3],[1,8,2],[1,6,4],[1,10,4],[1,10,5],[10,10,6],[1,9,6],[1,8,6],[6,6,5],[6,7,6],[6,5,4],[7,5,5],[7,6,6],[7,8,1],[6,9,1],[7,9,2],[6,10,2],[7,10,3],[5,3,4],[5,4,4],[2,7,7],[5,11,3],[5,12,3],[6,13,3],[2,13,4],[2,13,5],[2,13,6],[2,13,7],[2,13,8],[2,13,9],[2,7,8],[2,7,9],[7,7,10],[8,13,10],[5,12,10],[5,11,10],[5,10,10],[5,9,10],[5,8,10],[1,8,8],[1,8,9],[1,8,7],[1,9,7],[1,10,7],[1,11,7],[1,11,6],[1,11,4],[1,11,5],[1,12,4],[1,12,6],[1,12,5],[1,12,7],[1,12,8],[1,12,9],[1,11,9],[1,11,8],[1,10,8],[1,9,8],[1,9,9],[1,10,9]]"
    },
    {
        "name": "First Floor",
        "data": "[[1,1,1],[4,0,0],[5,1,0],[5,2,0],[5,3,0],[6,4,0],[7,4,1],[5,5,1],[12,6,1],[5,7,1],[5,8,1],[5,9,1],[5,10,1],[5,11,1],[5,12,1],[5,13,1],[5,14,1],[5,15,1],[5,16,1],[6,17,1],[2,17,2],[2,17,3],[2,17,4],[2,17,5],[9,2,2],[2,0,1],[2,0,2],[2,0,3],[2,0,4],[2,0,5],[2,0,6],[7,0,7],[5,1,7],[5,2,7],[5,3,7],[5,4,7],[5,5,7],[11,6,7],[5,7,7],[5,8,7],[5,10,7],[5,9,7],[5,12,7],[5,11,7],[5,13,7],[5,15,7],[5,14,7],[5,16,7],[8,17,7],[2,17,6],[1,2,1],[1,3,1],[1,3,2],[1,1,2],[1,1,3],[1,2,3],[1,3,3],[13,6,2],[1,8,4],[1,10,6],[1,11,4],[1,13,2],[1,15,4],[10,13,5],[10,9,5],[10,11,5],[1,12,3],[1,10,3],[1,14,5],[1,12,5],[1,8,6],[1,7,6],[1,4,6],[1,1,4],[1,2,4],[1,4,4],[1,4,3],[1,4,2],[1,5,2],[1,5,3],[1,5,4],[1,10,5],[1,10,4],[1,9,4],[10,9,3],[1,7,3],[1,8,3],[1,7,2],[1,8,2],[1,9,2],[1,10,2],[1,11,2],[10,11,3],[1,12,2],[1,7,5],[1,8,5],[1,6,3],[1,6,4],[1,7,4],[1,6,5],[3,6,6],[1,5,6],[1,4,5],[1,5,5],[1,3,4],[1,3,5],[1,3,6],[1,2,6],[1,2,5],[1,1,5],[1,1,6],[1,9,6],[1,11,6],[1,12,6],[1,13,6],[1,14,6],[1,12,4],[1,13,4],[10,13,3],[1,14,3],[1,14,4],[1,14,2],[1,15,2],[1,15,3],[1,15,5],[1,15,6],[1,16,6],[1,16,5],[1,16,4],[1,16,3],[1,16,2]]"
    },
]

hamsterRef = {
    "file": images.player.car,
    "nl": {
        "x": 1,
        "y": 1,
        "w": 32,
        "h": 16,
    },
    "b": {
        "x": 35,
        "y": 1,
        "w": 32,
        "h": 16,
    },
    "br": {
        "x": 1,
        "y": 20,
        "w": 32,
        "h": 16,
    },
    "r": {
        "x": 35,
        "y": 20,
        "w": 32,
        "h": 16,
    }
}

var levelRef = {
    "file": images.level.tileset,
    "default": {
        "x": 0,
        "y": 0,
        "w": 32,
        "h": 32,
        "type": "blank"
    },
    "tiles": [
        {
        },
        {
            "x": 32,
            "type": "floor"
        },
        {
            "x": 64,
            "type": "wall"
        },
        {
            "x": 96,
            "type": "wall"

        },
        {
            "x": 128,
            "type": "wall"
        },
        {
            "x": 160,
            "type": "wall"
        },
        {
            "x": 192,
            "type": "wall"
        },
        {
            "x": 224,
            "type": "wall"
        },
        {
            "x": 256,
            "type": "wall"
        },
        { // player
            "x": 32,
            "type": "floor"
        },
        { // human
            "x": 32,
            "type": "floor"
        },
        {
            "x": 352,
            "type": "wall"
        },
        {
            "x": 384,
            "type": "wall"
        },
        {
            "x": 416,
            "type": "wall"
        },
    ]
}

var humanRef = {
    "file": images.level.human,
    "normie": {
        "x": 0, "y": 0, "w": 32, "h": 32
    }
}


for (let tile of levelRef.tiles) {
    // if the tile is missing properties from the default, add them
    for (let key in levelRef.default) {
        if (!tile[key]) {
            tile[key] = levelRef.default[key];
        }
    }
}

console.debug(images)
var targFPS = 60;
var frame = 0;


var menu = new Room("menu");

menu.s = 0
menu.o = [
    {
        "t": "Play",
        "a": _=>{ setRoom(4) } // go to game room
    },
    {
        "t": "Editor",
        "a": _=>{ setRoom(3) } // go to level editor
    },
    {
        "t": "Settings",
        "a": _=>{ setRoom(5) }
    }
]


menu.drawGUI = () => {
    c.dT("Death by Hamster", c.w/2, c.h/2-25, 4, 4, "white", "middle", "middle");
    c.dT("W/Up or S/Down to select", c.w/2, c.h/2, 1,1,"gray","middle","middle");
    c.dT("Space or ENTER to activate", c.w/2, c.h/2+8, 1,1,"gray","middle","middle")
    for (let o in menu.o) {
        let txt = c.dT(`${menu.o[o].t}`, c.w/2, (c.h/2+50)+(o*20), 2,2,"#fff","middle","top");
        if (menu.s == o) {
            let a = images.ui.a;
            let ap = ((c.w/2)-(txt.w/2))-a.width-4;
            let ap2 = ((c.w/2)+(txt.w/2))+a.width-4;
            c.drawImg(a, ap, (c.h/2+50)+(o*20), a.width*2, a.height*2)
            c.drawImg(a, ap2, (c.h/2+50)+(o*20), a.width*2, a.height*2, 180)
        }
    }
}
const nextRoom = () => {
    // move to the next room
    roomI++;
    if (roomI >= rooms.length) {
        roomI = 0;
    }
    cRoom = rooms[roomI];
    cRoom.start();
}

const prevRoom = () => {
    // move to the previous room
    roomI--;
    if (roomI < 0) {
        roomI = rooms.length - 1;
    }
    cRoom = rooms[roomI];
    cRoom.start();
}

const setRoom = (roomI) => {
    // set the current room to the given room
    cRoom = rooms[roomI];
    cRoom.start();
}
menu.keyDown = (key) => {
    if (key == "ArrowUp" || key == "KeyW") {
        menu.s -= 1
        if (menu.s < 0) {
            menu.s = menu.o.length-1
        }
    }
    if (key == "ArrowDown" || key == "KeyS") {
        menu.s += 1
        if (menu.s > menu.o.length-1) {
            menu.s = 0
        }
    }
    if (key == "Space" || key == "Enter") {
        menu.o[menu.s].a();
    }
}

var gameRoom = new Room("Game");
gameRoom.humans = 0
var player   = new Entity("Player", 0,0);
player.speed = 0;
player.maxSpeed = 20;
player.direction = 0;
player.accel = 1.5;
player.sprite = images.player.car;
player.crop = hamsterRef.nl;
player.x = 0;
player.y = 0;
player.w = player.crop.w*2;
player.h = player.crop.h*2;
player.oldDir = 0;

player.step = _=> {
    // move in this.direction, which is an angle in degrees
    player.x += player.speed * Math.cos(player.direction * pi / 180);
    player.y += player.speed * Math.sin(player.direction * pi / 180);
    // check that the player won't go into a wall on the next step, and if so, stop.
    player.checkpoints = [];
    for (let i = 0; i < 6; i++) {
        
        let carCx = player.x + player.w/2;
        let carCy = player.y + player.h/2;
        
        let pointOx = 0;
        let pointOy = 0;
        if (i==0) {
            pointOx = -32;
        } else if (i==1) {
            pointOx = 32;
        } else if (i==2){
            pointOx = -30;
            pointOy = -15;
        } else if (i==3){
            pointOx = -30;
            pointOy = 15;
        } else if (i==4){
            pointOx = 30;
            pointOy = -15;
        } else if (i==5){
            pointOx = 30;
            pointOy = 15;
        }


        // get gunx and guny by moving backwards (gunOx and gunOy) from the center of the car in this.direction
        let pointX = carCx - pointOx * Math.cos(player.direction * pi / 180) - pointOy * Math.sin(player.direction * pi / 180);
        let pointY = carCy - pointOx * Math.sin(player.direction * pi / 180) + pointOy * Math.cos(player.direction * pi / 180);

        player.checkpoints.push({x: pointX, y: pointY});

        player.speed *= 0.9;

    }

    for (let checkpoint of player.checkpoints) {
        let x = checkpoint.x / 64;
        let y = checkpoint.y / 64;
        if (gameRoom.checkwall(x, y)) {
            checkpoint.stuck = true;
        }
    }

    if (player.checkpoints[0].stuck || player.checkpoints[1].stuck) {
        // move down sideways if stuck
        player.direction = player.oldDir;
        player.x = player.xy[0];
        player.y = player.xy[1];
        player.speed -= 0.1;
    }


    // keep the camera centered on the player
    c.setCamera(player.x - c.w/2, player.y - c.h/2);

    player.oldDir = player.direction;
    player.xy = [player.x, player.y]

}

console.log(player);

player.draw = _=> {
    // draw this.sprite at this.x, this.y
    c.sliceImage(player.sprite, player.x, player.y, player.w, player.h, player.crop.x, player.crop.y, player.crop.w, player.crop.h, player.direction);
    // c.dT(`${player.x/64} ${player.y/64}`, player.x, player.y, 1,1,"white","middle","middle");
    // canvas.strokeRect(player.x, player.y, player.w, player.h, "white");

    let gun = images.player.gun;
    let gunOx = 13;
    let gunOy = 0;

    let carCx = player.x + player.w/2;
    let carCy = player.y + player.h/2;
    
    // get gunx and guny by moving backwards (gunOx and gunOy) from the center of the car in this.direction
    let gunx = carCx - gunOx * Math.cos(player.direction * pi / 180) - gunOy * Math.sin(player.direction * pi / 180);
    let guny = carCy - gunOx * Math.sin(player.direction * pi / 180) + gunOy * Math.cos(player.direction * pi / 180);
    player.gx = gunx
    player.gy = guny

    // get the angle between the gun and the mouse
    player.aim = Math.atan2(c.mousePos.y - guny, c.mousePos.x - gunx) * 180 / pi;

    // canvas.drawText(`Width${gun.width} Height${gun.height}`, gunx, guny-15, 1, 1, "green", "middle", "middle");
    c.drawImg(gun, gunx, guny, gun.width*2, gun.height*2, player.aim, gunx, guny); // these two vars at the end are where the gun's center is placed
    // canvas.drawRect(gunx, guny, 1,1, "red");

    for (let checkpoint of player.checkpoints) {
        c.drawRect(checkpoint.x, checkpoint.y, 1,1, "black");

    }

    c.dT(`${Math.round(player.speed*100000)/100000}` ,player.x, player.y, 1,1, "white")

}   

player.shoot = () => {
    // shoot a bullet
    let bullet = new Entity("Bullet", player.gx, player.gy);
    bullet.speed = 20;
    bullet.direction = player.aim;
    bullet.w = 2;
    bullet.h = 2;
    
    bullet.step = () => {
        // for each step, check if it's path intersects with any other entity
        for (let i = 0; i < cRoom.objects.length; i++) {
            let ent = cRoom.objects[i];
            if (ent != bullet && ent.intersects(bullet)) {
                // if it does, remove the bullet and the entity unless it's the player
                console.log(ent);
                if (ent != player) {
                    cRoom.objects.splice(i, 1);
                    cRoom.objects.splice(cRoom.objects.indexOf(bullet), 1);
                    gameRoom.humans -= 1;
                    return;
                }
            }

        }
        if (gameRoom.checkwall(bullet.x/64,bullet.y/64)) {
            cRoom.objects.splice(cRoom.objects.indexOf(bullet), 1);
        }
        // if it doesn't, move the bullet
        bullet.x += bullet.speed * Math.cos(bullet.direction * pi / 180);
        bullet.y += bullet.speed * Math.sin(bullet.direction * pi / 180);
    }
    bullet.draw = () => {
        c.drawRect(bullet.x, bullet.y, bullet.w,bullet.h, "#2f2f2f");
    }
    cRoom.spawn(bullet);
}


gameRoom.spawn(player);

gameRoom.keyDown = (key) => {
    console.log(key);

    if (key == "ArrowUp" || key == "KeyW") {
        player.speed += player.accel;
        if (player.speed > player.maxSpeed) {
            player.speed = player.maxSpeed;
        }
    }
    if (key == "ArrowDown" || key == "KeyS") {
        player.speed -= player.accel*.8
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
    if (key == "Space") {
        player.shoot();
    }
}
gameRoom.keyHeld = (key) => {
    if (key == "ArrowUp" || key == "KeyW") {
        player.speed += player.accel*1.9;
        if (player.speed > player.maxSpeed) {
            player.speed = player.maxSpeed;
        }
    }
    if (key == "ArrowDown" || key == "KeyS") {
        player.speed -= player.accel*1.53;
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
gameRoom.click = (e) => {
    player.shoot();
}
gameRoom.checkwall = (tx,ty) => {
    tx = Math.floor(tx);
    ty = Math.floor(ty);
    for (let tile of gameRoom.level) {
        if (levelRef.tiles[tile[0]].type == "wall" && tile[1] == tx && tile[2] == ty) {
            return true;
        }
    }
    return false;
}

gameRoom.start = () =>{
    if (customLv) {
        gameRoom.level = customLv
    }
    gameRoom.level = JSON.parse(gameRoom.level);

    if (gameRoom.tutorial) {
        player.accel = .7
    }


    for (let tile of gameRoom.level) {
        if (tile[0] === 9) {
            player.x = (tile[1]*64)+32
            player.y = (tile[2]*64)+32
        }
        if(tile[0]===10){

            let pooman = new Entity("Human", (tile[1]*64),(tile[2]*64), images.level.human)
            pooman.w = 26*2
            pooman.h = 16*2
            pooman.bh = Math.floor(Math.random()*3);
            pooman.bb = Math.floor(Math.random()*3)
            pooman.getT=_=>{
                pooman.tX = Math.floor((pooman.x + pooman.w) / 64)
                pooman.tY = Math.floor((pooman.y + pooman.h) / 64)
            }
            pooman.step = _=>{
                let xy = [pooman.x, pooman.y]
                if (pooman.timer<=0){
                    let director = Math.floor(Math.random()*4)
                    pooman.direction = director*90;
                    if (director === 0){
                        pooman.y -= pooman.h;
                    }
                    if (director === 1){
                        pooman.x += pooman.w;
                    }
                    if (director === 2){
                        pooman.y += pooman.w;
                    }
                    if (director === 3){
                        pooman.x -= pooman.h;
                    }
                    pooman.getT();
                    if (gameRoom.checkwall(pooman.tX, pooman.tY)){
                        pooman.x = xy[0]
                        pooman.y = xy[1]
                        pooman.step()
                        return
                    }

                    pooman.timer = 90;
                }
                pooman.timer--;
            }
            pooman.draw = _=>{
                c.sliceImage(pooman.sprite, pooman.x, pooman.y, pooman.w, pooman.h, pooman.bb*pooman.w/2, 0, pooman.w/2, pooman.h/2, pooman.direction);
                c.sliceImage(pooman.sprite, pooman.x, pooman.y, pooman.w, pooman.h, pooman.bh*pooman.w/2, pooman.h/2, pooman.w/2, pooman.h/2, pooman.direction);
                c.dT(`${pooman.timer} :: ${pooman.direction}`, pooman.x, pooman.y, 1, 1, "white", "middle", "middle");
            }
            pooman.timer = 90;
            gameRoom.spawn(pooman);
            gameRoom.humans += 1;
        }
    }
}

gameRoom.step = _=> {
    if (gameRoom.humans == 0){
        setRoom(0)
    }
    // step all objects in the room
    for (let obj of gameRoom.objects) {
        obj.step();
    }
}

gameRoom.draw = () => {

    for (let tile of gameRoom.level) {
        // [index, x, y]
        c.sliceImage(levelRef.file, (tile[1]*32)*2, (tile[2]*32)*2, 32*2,32*2, levelRef.tiles[tile[0]].x, 0, 32, 32);
    }

    if (gameRoom.tutorial) {
        c.dT("Welcome to", 3*64, 64+15, 1, 1, "black");
        c.dT("Death by Hamster", (3*64)+32, 64+25, 2,2, "black", "middle");

        c.dT("Use WASD/arrows to move", 128, 2*64, 1,1, "black");
        c.dT("Aim with the mouse and click to shoot!", 128, 2*64+10, 1,1, "black");

        c.dT("As a member of the hamster uprising,", 6*64, 3*64+25, 1,1, "black");
        c.dT("you might want to kill any humans", 6*64, 3*64+35, 1,1, "black");
        c.dT("you find!", 10*64-16, 3*64+45, 1,1, "black", "right");


    }
    for (let i = 0; i < cRoom.objects.length; i++) {
        cRoom.objects[i].draw();
    }
}

let editor = new Room("Editor");
editor.i = 0;
editor.t = levelRef;
editor.l = []
editor.saving = false
editor.sa = 0

editor.start = _=>{
    editor.dPos = [15,65]
}
editor.draw = _=>{
    for (let tile of editor.l) {
        // [index, x, y]
        c.sliceImage(levelRef.file, (tile[1]*32)+editor.dPos[0], tile[2]*32+editor.dPos[1], 32,32, tile[0]*32, 0, 32, 32);
        c.drawRect(editor.dPos[0], editor.dPos[1], 1,1, "red")
    }
}
editor.step = _=>{
    if (editor.i < 0) {
        editor.i = levelRef.tiles.length-1;
    }
    if (editor.i > levelRef.tiles.length-1) {
        editor.i = 0;
    }
}
editor.generate = _=>{
    editor.saving=1
    for (let tile of editor.l) {
        if (tile[0] == 0){
            editor.l.splice(editor.l.indexOf(tile))
        }
    }
    let encodedLevel = JSON.stringify(editor.l)
    if (encodedLevel != editor.data){
        document.getElementById("leveltext").innerText = encodedLevel;
        document.getElementById("levelLink").innerHTML = `<a href="/?lv=${encodedLevel}&goto=2">Play</a>`
    }
    editor.data = encodedLevel;
    editor.saving=0;
    editor.sa = 1;
}
editor.click = (x,y)=>{
    if (y < 50) {
        if (x> 516 && y < 50) {
            if (!editor.saving){
                editor.generate()
            }
            editor.saveclick = true
        }
    }
    else {
        x = Math.floor((x-editor.dPos[0])/32)
        y = Math.floor((y-editor.dPos[1])/32)
        // console.debug(x,y)
        for (let t in editor.l) {
            if (editor.l[t][1] == x && editor.l[t][2] == y) {
                editor.l[t] = [editor.i, x, y];
                return;
            }
        }
        editor.l.push([editor.i,x,y])
        editor.sa = 0
    }
}
editor.keyHeld = (key) => {
    switch (key) {
        case "KeyW":
        case "ArrowUp":
            editor.dPos[1] += 4
            break;
        case "KeyS":
        case "ArrowDown":
            editor.dPos[1] -= 4
            break;
        case "KeyA":
        case "ArrowLeft":
            editor.dPos[0] += 4
            break;
        case "KeyD":
        case "ArrowRight":
            editor.dPos[0] -= 4
            break;
    }
}

editor.drawGUI = _=>{
    c.drawRect(0,0,c.w,50,"gray")
    c.dT(`DBH Editor::${editor.n}`, 15,25,2,2,"#fff","start","middle");
    let s = c.dT(`Save`, c.w-15,25,2,2,"#fff","end","middle");
    if (c.mousePos.x > (c.w-30)-s.w && c.mousePos.y < 50) {
        // console.debug((c.w-30)-s.w)
        c.dT(`Save`, c.w-15,25,2,2,"#e5e5e5","end","middle");
    }
    if (editor.sa) {
        c.dT(`Save`, c.w-15,25,2,2,"#1fdc2f","end","middle");
    } if (editor.saving) {
        c.dT(`Save`, c.w-15,25,2,2,"#1fccdc","end","middle");
    }

    c.sliceImage(editor.t.file, c.mousePos.x+16,c.mousePos.y+16,32,32,32*editor.i,0,32,32);
}

let lvlS = new Room("Level Select")
lvlS.s = 0
lvlS.o = levels

lvlS.drawGUI = () => {
    c.dT("Death by Hamster", c.w/2, 25, 2, 2, "white", "middle", "top");
    c.dT("Level Select", c.w/2, 44, 1,1,"gray","middle","middle");
    for (let o in lvlS.o) {
        let n = parseInt(o)+1
        c.dT(`${n}`, (20)+(32*n), 70, 2, 2, "#fff", "middle", "middle")
        if (o == lvlS.s) {
            c.strokeRect((20-14)+(32*n), 70-16, 32, 32, "#fff")
        }
    }
}

lvlS.keyDown = (key) => {
    if (key == "ArrowUp"||key=="ArrowRight"||key == "KeyW"||key=="KeyD") {
        lvlS.s -= 1
        if (lvlS.s < 0) {
            lvlS.s = lvlS.o.length-1
        }
    }
    if (key == "ArrowDown" ||key=="ArrowLeft"||key == "KeyW"|| key == "KeyA") {
        lvlS.s += 1
        if (lvlS.s > lvlS.o.length-1) {
            lvlS.s = 0
        }
    }
    if (key == "Space" || key == "Enter") {
        gameRoom.level = lvlS.o[lvlS.s].data;
        if (lvlS.s === 0){
            gameRoom.tutorial = 1;
        }
        setRoom(2)
    }
    if (key == "KeyE") {
        editor.l = JSON.parse(lvlS.o[lvlS.s].data);
        setRoom(3)
    }
}

var options = new Room("Settings")
options.s = 0
options.ops = o;
options.o = [{
    "t": "Show FPS",
    "a": _=>{ o.showFPS = !o.showFPS },
    "v": "showFPS"
}, {
    "t": "Menu",
    "a": _=>{ setRoom(0) }
}]

options.drawGUI = () => {
    c.dT("Settings", c.w/2, 25, 2, 2, "#fff", "middle", "top");
    for (let o in options.o) {
        let s = options.o[o]
        let txt = c.dT(`${options.o[o].t}`, 150, 50+(o*20), 2,2,"#fff","left","top");
        if (options.s == o) {
            let a = images.ui.a;
            c.drawImg(a, 136, 50 + (o * 20), a.width * 2, a.height * 2)
        }
        let v = options.ops[s.v]
        if (!(v==undefined)){
            c.dT(`${v}`, 450, 50+(o*20), 2,2,"#fff", "right");

        }
    }
}

options.keyDown = (key) => {
    if (key == "ArrowUp"||key=="ArrowRight"||key == "KeyW") {
        options.s -= 1
        if (options.s < 0) {
            options.s = options.o.length-1
        }
    }
    if (key == "ArrowDown" ||key=="ArrowLeft"||key == "KeyW") {
        options.s += 1
        if (options.s > options.o.length-1) {
            options.s = 0
        }
    }
    if (key == "Space" || key == "Enter") {
        if (options.o[options.s].a){
            options.o[options.s].a()
        }
    }
}


rooms.push(loader);
rooms.push(menu);
rooms.push(gameRoom);
rooms.push(editor);
rooms.push(lvlS);
rooms.push(options)
var roomI = !gPar("goto") ? 0 : gPar("goto");

var cRoom = rooms[roomI];


var keysPressed = {};
var keysLastPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
    keysLastPressed[e.code] = false;
} );

var lastTime = 0;

var mse = {x: 0, y: 0};
var lastClick = {x: 0, y: 0};
var leftclicked = false;
var rightclicked = false

c.c.addEventListener('mousemove', (e) => {
    mse = c.getMousePos(e);
} );

c.c.addEventListener("mousedown", (e) => {
    // console.log(e);
    e.preventDefault()
    lastClick = c.getMousePos(e);
    mse = c.getMousePos(e);
    switch (e.button) {
        case 0: // left
            leftclicked=1;
            break;
        case 1:
            rightclicked=1;
            break;
    }
});
c.c.addEventListener("mouseup", (e)=>{
    // console.log(e);
    lastClick = c.getMousePos(e);
    mse = c.getMousePos(e);
})
c.c.oncontextmenu = _=>{return 0;}

window.onwheel = (e)=>{
    if (e.deltaY > 0) {
        editor.i += 1;
    }
    if (e.deltaY < 0) {
        editor.i -= 1;
    }
}

try {
cRoom.start();

    var gameLoop = setInterval(() => {
        c.tW = c.c.offsetWidth;
        c.tH = c.c.offsetHeight;
        c.scale = c.tW / c.w;
        frame++;
        c.fill(cRoom.background);
    
        for (let key in keysPressed) {
            if (keysPressed[key]) {
                if (!keysLastPressed[key]) {
                    cRoom.keyDown(key);
                    keysLastPressed[key] = true;
                } else if (keysLastPressed[key]) {
                    cRoom.keyHeld(key);
                }
            }
        }
        if (leftclicked) {
            cRoom.click(lastClick.x, lastClick.y);
            leftclicked = 0;
        }
    
        cRoom.step();
        cRoom.draw();
        cRoom.drawGUI(); 
    
        /* BEDUG INFO */
        if (o.showFPS){
            c.dT(`FPS:${Math.round(1000 / (Date.now() - lastTime))}`, 0+c.camera.x, 0+c.camera.y, 1, 1, "#fafafa", "left", "top");
        }



        switch (cRoom.name) {
            case "menu":
            case "Editor":
                c.ctx.drawImage(images.mouse.cursor, Math.round(mse.x), Math.round(mse.y), images.mouse.cursor.width*2, images.mouse.cursor.height*2);
                break;
            case "Game":
                c.dT(`Humans:${gameRoom.humans}`, (c.w)+c.camera.x, 0+c.camera.y, 1,1,"#fff", "end")
                c.ctx.drawImage(images.mouse.ingame, Math.round(mse.x)-16, Math.round(mse.y)-16, 32, 32);
                break;
        }
        lastTime = Date.now();
    
    } , 1000/targFPS); // 60 fps
    
} catch (error) {
    c.fill("#1c1c1c");
    c.dT("Death By Hamster", c.w / 2, c.h / 2 - 40, 2, 2, "white", "middle");
    c.dT(`${error}`, c.w/2, c.h / 2, 1, 1, "red", "middle");
    c.dT(`pls let Bye know by emailing him via`, c.w /2, c.h / 2 + 40, 1, 1, "white", "middle");
    c.dT('bye[at]byecorps.com', c.w / 2, c.h / 2 + 60, 2, 2, "white", "middle");
}
