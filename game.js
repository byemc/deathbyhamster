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

// this is the canvas check
var supportsCanvas = !!document.createElement("gameCanvas").getContext;

if (!supportsCanvas) {
    alert("Your browser does not support the canvas element. Please update your browser to the latest version.");
}
class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.realWidth = 640;
        this.realHeight = 480;

        this.mousePos = {x: 0, y: 0};

        this.camera = {x: 0, y: 0};
    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Mouse position crap
    getMousePos(e) {
        let rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = (e.clientX - rect.left) / 2;
        this.mousePos.y = (e.clientY - rect.top) /2;

        document.getElementById('mousePos').innerHTML = `${this.mousePos.x}, ${this.mousePos.y}`;
    }

    // Drawing
    drawImg(img, x, y, w, h) {
        this.ctx.drawImage(img, x-this.camera.x, y-this.camera.y, w, h);
    }

    drawRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x-this.camera.x, y-this.camera.y, w, h);
    }

    drawText(string, x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillText(string, x-this.camera.x, y-this.camera.y);
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
    mvCamera(x, y) {
        this.camera.x += x;
        this.camera.y += y;
    }

    setCamera(x, y) {
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
}

class Hamster { // Player class
    constructor(name="", trueX=0, trueY=0) {
        this.name = name;
        this.velocity = {x: 1, y: 0};
        this.maxVelocity = {x: 2, y: 2};
        this.trueX = trueX
        this.trueY = trueY
        // x and y are the position of the hamster relative to the camera
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;
        this.aim = {x: 0, y: 0};

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
        this.aim.angle = Math.atan2(this.aim.y - this.y - 10, this.aim.x - this.x - 10);    
        
        document.getElementById('truexy').innerText = `${this.trueX}, ${this.trueY}`;
        document.getElementById('hamxy').innerText = `${this.x}, ${this.y}`;

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
        canvas.drawRect(this.x, this.y, 20, 20, "red");
        // draw the name above the hamster
        
        canvas.drawText(this.name, this.x, this.y - 10, "white");

        // draw a regtangle pointing at the aim, centered on the middle of the hamster
        canvas.drawLine(this.x + 10, this.y + 10, this.x + 10 + Math.cos(this.aim.angle) * 10, this.y + 10 + Math.sin(this.aim.angle) * 10, "white");
    }

    shoot(e) {
        // shoot to the mouse position from the hamster, with a velocity of 1
        let bullet = new Bullet(this.x + 10, this.y + 10, this.aim.angle, 0.1);
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


    }

    draw(canvas) {
        canvas.drawRect(this.x, this.y, 20, 20, "blue");
        canvas.drawText(`human${this.humanID}`, this.x, this.y - 10, "white");
    }

    die() {
        // remove the hitbox from the hitboxes array
        hitboxes.splice(hitboxes.indexOf(this.hitbox), 1);
        // remove the human from the humans array
        humans.splice(humans.indexOf(this), 1);

        canvas.setFont("Arial", "20");
        canvas.ctx.textAliign = "center";
        canvas.drawText("Kill!", this.x, this.y, "red");
        canvas.setFont(fontStack);
    }
}

class Bullet {
    constructor(direction, x, y, velocity) {
        this.direction = direction;
        this.trueX = x;
        this.trueY = y;
        this.x = x - canvas.camera.x;
        this.y = y - canvas.camera.y;
        this.velocity = velocity;

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
                
                // find the human by the hitbox ID and remove it from the humans array with the Die function
                for (let j = 0; j < humans.length; j++) {
                    if (humans[j].hitbox.id == hitboxes[i].id) {
                        humans[j].die();
                    }
                }

            }
        }
    }

    draw(canvas) {
        // draw a rectangle with a size of 2x3 at the position of the bullet, pointing in the direction of the angle
        canvas.drawRect(this.trueX, this.trueX, 2, 3, "white");
    }
}



// INIT CANVAS
var canvas = new Canvas('gameCanvas');
if (canvas.ctx == null) {
    log('ERROR', 'Could not initialize canvas');
    alert('Your browser doesn\'t support canvas. Most modern browsers support it, so please upgrade to IE 9 or newer.');
}
gameCtx = canvas.ctx;
canvas.fill("#1c1c1c");
canvas.setFont(fontStack);
gameCtx.imageSmoothingEnabled = false;

// Game init
var player = new Hamster("Player", canvas.width/2, canvas.height/2);
var humans = [];

player.draw(canvas);

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
    mousePos = canvas.getMousePos(e);
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
var gameStart = false;

// game loop
var gameLoop = setInterval(() => {
    
    canvas.fill("#1c1c1c");
    canvas.drawText(frames, 10, 10, "red");
    frames++;
    
    
    if (frames > 30) {
        gameStart = true;
    }

    if (gameStart) {

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

        // draw humans
        for (var i = 0; i < humans.length; i++) {
            humans[i].draw(canvas);
        }
        player.draw(canvas);

        // draw bullets
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].update();
            bullets[i].draw(canvas);
        }

        document.getElementById("dbg_camera").innerText = `x: ${canvas.camera.x}, y: ${canvas.camera.y}`;

        // check if a bullet has collided with a human
        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < humans.length; j++) {
                if (bullets[i].hitbox.collides(humans[j].hitbox)) {
                    // if the bullet has collided with a human, remove the bullet and the human
                    bullets.splice(bullets.indexOf(bullets[i]), 1);
                    humans.splice(humans.indexOf(humans[j]), 1);
                }
            }
        }

}
} , 1000/60);
