/* 
    For js13k 2022
    Theme: death
*/

// Functions for my little game engine thing
const log = (logType, msg) => {
    console.log(`[${logType}] ${msg}`);
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
        this.ctx.drawImage(img, x, y, w, h);
    }

    drawRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawText(string, x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillText(string, x, y);
    }

    setFont(fontStack=fontStack, size="10") {
        this.ctx.font = `${size}px ${fontStack}`
    }

    drawLine(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

}

// Entity classes

class Hamster {
    constructor(name="", trueX=0, trueY=0) {
        this.name = name;
        this.velocity = {x: 1, y: 0};
        this.maxVelocity = {x: 2, y: 2};
        this.trueX = trueX
        this.trueY = trueY
        this.x = Math.round(this.trueX);
        this.y = Math.round(this.trueY);


        this.aim = {x: 0, y: 0};

    }

    // collision detection

    update() {
        this.trueX += this.velocity.x;
        this.trueY += this.velocity.y;
        this.x = Math.round(this.trueX);
        this.y = Math.round(this.trueY);
        // decrease velocity
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
        // log(`DEBUG Hamster ${this.name}`, `x: ${this.x}, y: ${this.y}`);
        // log(`DEBUG Hamster ${this.name}`, `velocity: x${this.velocity.x}, y${this.velocity.y}`);

        // set the aim to the current mouse pos
        this.aim.x = canvas.mousePos.x;
        this.aim.y = canvas.mousePos.y;

        log(`DEBUG Hamster ${this.name}`, `aim: x${this.aim.x}, y${this.aim.y}`);

        // draw a line from the hamster to the aim
        canvas.drawLine(this.x, this.y, this.aim.x, this.aim.y, "white");


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
    }
}

class Human {
    constructor(scared, x, y, targ_x, targ_y) {
        this.scared = scared;
        this.x = x;
        this.y = y;
        this.targ_x = targ_x;
        this.targ_y = targ_y;
        this.speed = 0.005;
        this.velocity = {x: 0, y: 0};
    }

    update() {
        if (this.scared) {
            this.velocity.x = this.targ_x - this.x;
            this.velocity.y = this.targ_y - this.y;
        } else {
            this.velocity.x = this.targ_x - this.x;
            this.velocity.y = this.targ_y - this.y;
        }
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
        // log(`DEBUG Human`, `x: ${this.x}, y: ${this.y}`);
        // log(`DEBUG Human`, `velocity: x${this.velocity.x}, y${this.velocity.y}`);

        // if the human is close to the target, pick a new target
        if (Math.abs(this.x - this.targ_x) < 10 && Math.abs(this.y - this.targ_y) < 10) {
            this.targ_x = Math.floor(Math.random() * canvas.width);
            this.targ_y = Math.floor(Math.random() * canvas.height);
        }
    }

    draw(canvas) {
        canvas.drawRect(this.x, this.y, 20, 20, "blue");
        canvas.drawText("Poo man", this.x, this.y - 10, "white");
    }
}

// CONFIG
const fontStack = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

// INIT CANVAS
var canvas = new Canvas('gameCanvas');
if (canvas.ctx == null) {
    log('ERROR', 'Could not initialize canvas');
    alert('Your browser doesn\'t support canvas. Most modern browsers support it, so please upgrade to IE 9 or newer.');
}
gameCtx = canvas.ctx;
canvas.fill("#1c1c1c");
canvas.setFont(fontStack);

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
    var mousePos = canvas.getMousePos(e);
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
}
} , 1000/60);
