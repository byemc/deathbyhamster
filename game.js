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

    drawText(string, x, y, scaley, scalex, color, align="start") {

        // console.log(string)

        string = string.toUpperCase();
        let chars = string.split("");
        console.log(chars);
        
        let charWidth = 7
        let strLength = (chars.length * charWidth) * scalex; 

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

        
        let charI = 0;
        
        for (let char of chars) {
            
            this.ctx.fillStyle = color;
            let row = 0;
            let col = 0;
            // offset is the amount of pixels to offset the character by. you can calculate this by multiplying the current character (they're all the same size) by the scalex and scaley
            let offset = (7 * scalex);

            char = fIndex[char];
            if (char == undefined) {
                // leave a blank space
            } else {
                for (let cRow in char) {
                    col = 0;
                    // for each pixel in the row
                    for (let c of char[cRow]) {
                        if (c == 1) {
                            this.ctx.fillRect(x + (col * scalex) + (charI * offset), y + (row * scaley), scalex, scaley);

                        }
                        col++;
                    }
                    row++;
                }
            }

            charI++;
            console.log(charI)

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

class Hitbox {
    constructor(x, y, w, h, owner=null) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.owner = owner;
    }

    collides(other) {
        // check if this hitbox collides with another hitbox
        if (this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.h + this.y > other.y) {
                return true;
            }
        return false;
    }

    draw() {
        // draw the hitbox
        canvas.strokeRect(this.x+canvas.camera, this.y, this.w, this.h, 'green');
    }
}

class Hamster { // Player class
    constructor(name="", trueX=0, trueY=0) {
        this.name = name;
        this.velocity = {x: 0, y: 0};
        this.maxVelocity = {x: 2, y: 2};
        this.trueX = trueX
        this.trueY = trueY
        // x and y are the position of the hamster relative to the camera
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;
        this.aim = {x: 0, y: 0};

        this.sprite = new Image();
        this.sprite.src = "";

        this.w = 20; // this'll change depending on the sprite's width
        this.h = 20; // this'll change depending on the sprite's height

    }

    update() {
        this.trueX += this.velocity.x;
        this.trueY += this.velocity.y;
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;
        // decrease velocity
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
        // log(`DEBUG Hamster ${this.name}`, `x: ${this.x}, y: ${this.y}`);
        // log(`DEBUG Hamster ${this.name}`, `velocity: x${this.velocity.x}, y${this.velocity.y}`);

        // set the aim to the current mouse pos
        this.aim.x = canvas.mousePos.x;
        this.aim.y = canvas.mousePos.y;

        // calculate the angle between the hamster and the mouse
        this.aim.angle = Math.atan2(this.aim.y - this.trueY - 10, this.aim.x - this.trueX - 10);    
        
        document.getElementById('truexy').innerText = `${this.trueX}, ${this.trueY}`;
        document.getElementById('hamxy').innerText = `${this.x}, ${this.y}`;

        // if (this.y < 10) {
        //     // move the camera up enough to keep the hamster in view, if the hamster is moving up
        //     if (this.velocity.y < 0) {
        //         canvas.mvCamera(0, this.velocity.y*1.1);
        //     }
            
        // }
        // if (this.y > 210) {
        //     if(this.velocity.y > 0) {
        //         canvas.mvCamera(0, this.velocity.y*1.1);
        //     }
        // }
        // if (this.x < 10) {
        //     if(this.velocity.x < 0) {
        //         canvas.mvCamera(this.velocity.x*1.1, 0);
        //     }
        // }
        // if (this.x > 290) {
        //     if(this.velocity.x > 0) {
        //         canvas.mvCamera(this.velocity.x*1.1, 0);
        //     }
        // }

        // center the camera on the hamster
        canvas.setCamera(this.trueX - canvas.width/2, this.trueY - canvas.height/2);




    }

    increaseVelocity(x, y) {
        this.velocity.x += x;
        this.velocity.y += y;
        if (this.velocity.x > this.maxVelocity.x) {
            this.velocity.x = this.maxVelocity.x;
        }
        if (this.velocity.y > this.maxVelocity.y) {
            this.velocity.y = this.maxVelocity.y;
        }
    }

    draw(canvas) {
        canvas.drawRect(this.trueX, this.trueY, 20, 20, "red");
        // draw the name above the hamster
        
        canvas.drawFont(this.name, this.trueX, this.trueY - 10, "white");
    }

    shoot(e) {
        // spawn a bullet pointing at the aim
        let bullet = new Bullet(this.aim.angle, this.trueX + 10, this.trueY + 10, 50);
        bullets.push(bullet);
    }
}

class Human {
    constructor(scared, trueX=0, trueY=0) {
        this.scared = scared;
        this.velocity = {x: 1, y: 0};
        this.maxVelocity = {x: 2, y: 2};
        this.trueX = trueX
        this.trueY = trueY
        // x and y are the position of the hamster relative to the camera
        this.velocity = {x: 0, y: 0};
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;

        this.targX = Math.floor(Math.random() * 1000);
        this.targY = Math.floor(Math.random() * 1000);

        // get an ID for the human
        this.humanID = Math.floor(Math.random() * 1000000);

        this.speed = 0.1;

        this.hitbox = new Hitbox(this.x, this.y, 20, 20, `human${this.humanID}`);
        hitboxes.push(this.hitbox);

    }

    update() {
        
        // if the human is near the target, move to a new target
        if (Math.abs(this.trueX - this.targX) < 10 && Math.abs(this.trueY - this.targY) < 10) {
            this.targX = Math.floor(Math.random() * 1000);
            this.targY = Math.floor(Math.random() * 1000);
        }
        // move towards the target
        if (this.trueX < this.targX) {
            this.trueX += this.speed;
        }
        if (this.trueX > this.targX) {
            this.trueX -= this.speed;
        }
        if (this.trueY < this.targY) {
            this.trueY += this.speed;
        }
        if (this.trueY > this.targY) {
            this.trueY -= this.speed;
        }
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;

        this.hitbox.x = this.x;
        this.hitbox.y = this.y;


    }

    draw(canvas) {
        canvas.drawRect(this.trueX, this.trueY, 20, 20, "blue");
        canvas.drawText(`human${this.humanID}`, this.trueX, this.trueY - 10, 1,1, "white");

        // draw the hitbox
        this.hitbox.draw(canvas);
    }

    die() {
        // remove the hitbox from the hitboxes array
        hitboxes.splice(hitboxes.indexOf(this.hitbox), 1);
        console.debug(`Human ${this.humanID} died, removing ${this.hitbox}`);
        // remove the human from the humans array
        humans.splice(humans.indexOf(this), 1);

        canvas.setFont("Arial", "20");
        canvas.drawFont("Kill!", this.trueX, this.trueY, "red", "center");
        canvas.setFont(fontStack);
    }
}

class Bullet {
    constructor(direction, x, y, velocity) {
        this.direction = direction;
        this.trueX = x;
        this.trueY = y;
        this.velocity = velocity/10;

        this.hitbox = new Hitbox(this.x, this.y, 10, 10, "bullet");
    }

    update() {
        // move in the direction of the angle
        this.trueX += Math.cos(this.direction) * this.velocity;
        this.trueY += Math.sin(this.direction) * this.velocity;

        // update the hitbox position
        this.hitbox.x = this.trueX - canvas.camera.x;
        this.hitbox.y = this.trueY - canvas.camera.y;
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;

        // the kill check: check if the bullet has collided with a hitbox. Use the collides function of the hitbox class
        for (let i = 0; i < hitboxes.length; i++) {
            if (this.hitbox.collides(hitboxes[i])) {
                // if the bullet has collided with a hitbox, remove the bullet and the hitbox
                bullets.splice(bullets.indexOf(this), 1);

                console.log(`Bullet ${this.hitbox.owner} collided with ${hitboxes[i].owner}`);
                console.log(`Removing ${hitboxes[i]}`);
                console.log(hitboxes[i])
                
                // find the human by the hitbox ID and remove it from the humans array with the Die function
                for (let j = 0; j < humans.length; j++) {
                    if (humans[j].hitbox.owner == hitboxes[i].owner) {
                        humans[j].die();
                    }
                }

            }
        }
    }

    draw(canvas) {
        // draw a rectangle with a size of 2x3 at the position of the bullet, pointing in the direction of the angle
        canvas.drawRect(this.trueX, this.trueY, 2, 3, "white");

        // DEBUG: draw the bullet's position
        canvas.drawFont(`${Math.round(this.trueX)}, ${Math.round(this.trueY)}`, this.trueX, this.trueY - 10, "white");
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

canvas.setFont(fontStack, "20");
canvas.drawText("Death By Hamster", canvas.width / 2, canvas.height / 2 - 40, 2, 2, "white", "middle");
canvas.setFont(fontStack);

// Load images
var images = {
    "mouse": {
        "ingame": "./assets/aimerthing.png",
    },
    "background": {
        "ingame": "./assets/crazyabackground_a.png",
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
            canvas.drawFont(`Error loading image ${images[key][subkey]}`, canvas.width / 2, canvas.height / 2 + 45, "red    ", "center");
        } );
        IMG.src = images[key][subkey];

        // add the image to the images object
        images[key][subkey] = IMG;
        
        // draw the loading text by drawing a rectangle over the previous text, and drawing the new text
        canvas.drawRect(canvas.width / 2 - 100, canvas.height / 2 + 30, 200, 50, "#1c1c1c");
        canvas.drawFont(`Loading images (${loadedImages} / ${totalImages})`, canvas.width / 2, canvas.height / 2 + 45, "white", "center");
        
    }
}



// Game init
var player = new Hamster("Player", canvas.width/2, canvas.height/2);
var humans = [];

// THe input checker-inator
/* Here's how it works:
If a keydown is detected, the key preforms it's action
    If it doesn't get unpressed in the tick, keep the velocity at the max
    */
   var keys = {};
   document.addEventListener('keydown', function(e) {
    keys[e.code] = true;
} );
document.addEventListener('keyup', function(e) {
    keys[e.code] = false;
} );

// On a mouse move, update the mouse position
canvas.canvas.addEventListener('mousemove', function(e) {
    canvas.getMousePos(e);
} );

canvas.canvas.addEventListener('mousedown', function(e) {
    // shoot!
    player.shoot(e);
} );

// Create 5 humans 
for (var i = 0; i < 5; i++) {
    var human = new Human(false, Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * canvas.width, Math.random() * canvas.height);
    humans.push(human);
}

// wait for 30 frames before starting the game
var frames = 0;

let kills = 0;
let target = 5;

// game loop
var gameLoop = setInterval(() => {
    
    if (gameStart) {
        canvas.fill("#1c1c1c");
        frames++;
        canvas.drawText("Text", 10-canvas.camera.x, 10-canvas.camera.y, 5,5, "white");


        // log("debug", "Tick!");

        // input checker
        if (keys["ArrowUp"]) {
            player.increaseVelocity(0, -0.3);
        } 
        if (keys["ArrowDown"]) {
            player.increaseVelocity(0, 0.3);
        } 
        if (keys["ArrowLeft"]) {
            player.increaseVelocity(-0.3, 0);
        } 
        if (keys["ArrowRight"]) {
            player.increaseVelocity(0.3, 0);
        } 
        if (keys["KeyW"]) {
            canvas.camera.y -= 1;
        }
        if (keys["KeyS"]) {
            canvas.camera.y += 1;
        }
        if (keys["KeyA"]) {
            canvas.camera.x -= 1;
        }
        if (keys["KeyD"]) {
            canvas.camera.x += 1;
        }

        player.update();



        // update humans
        for (var i = 0; i < humans.length; i++) {
            humans[i].update();
        }

        // draw the background
        // canvas.drawImage(images.background.ingame, 0, 0, canvas.width, canvas.height);

        // draw humans
        for (var i = 0; i < humans.length; i++) {
            humans[i].draw(canvas);
        }
        player.draw(canvas);

        // draw bullets
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].draw(canvas);
            // run the update 10 times per tick
            for (var j = 0; j < 10; j++) {
                try {
                    bullets[i].update();
                }
                catch (e) {
                    break;
                }
            }
        }

        canvas.drawImg(images.mouse.ingame, player.aim.x - 8, player.aim.y - 8, 16, 16);
        

        document.getElementById("dbg_camera").innerText = `x: ${canvas.camera.x}, y: ${canvas.camera.y}`;

        // // check if a bullet has collided with a human
        // for (var i = 0; i < bullets.length; i++) {
        //     for (var j = 0; j < humans.length; j++) {
        //         if (bullets[i].hitbox.collides(humans[j].hitbox)) {
        //             // if the bullet has collided with a human, remove the bullet and the human
        //             bullets.splice(bullets.indexOf(bullets[i]), 1);
        //             humans.splice(humans.indexOf(humans[j]), 1);
        //         }
        //     }
        // }

        if (kills == target) {
            gameStart = false;
            canvas.drawFont(`You win!`, canvas.width / 2, canvas.height / 2 + 45, "white", "center");
        }

}
} , 1000/60); // 60 fps
