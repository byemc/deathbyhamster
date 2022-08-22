
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
        this.velocity = 0; //forward velocity
        this.maxVelocity = 3;
        this.trueX = trueX
        this.trueY = trueY
        // x and y are the position of the hamster relative to the camera
        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;
        this.aim = {x: 0, y: 0};
        this.direction = Math.atan2(this.aim.y - this.trueY - 10, this.aim.x - this.trueX - 10);

        this.sprite = new Image();
        this.sprite.src = "";

        this.w = 20; // this'll change depending on the sprite's width
        this.h = 20; // this'll change depending on the sprite's height

    }

    update() {
        // Move forward in the required direction by one
        this.trueX += Math.cos(this.direction) * this.velocity;
        this.trueY += Math.sin(this.direction) * this.velocity;

        this.x = this.trueX - canvas.camera.x;
        this.y = this.trueY - canvas.camera.y;

        this.velocity *= 0.99;

        // log(`DEBUG Hamster ${this.name}`, `x: ${this.x}, y: ${this.y}`);
        // log(`DEBUG Hamster ${this.name}`, `velocity: x${this.velocity.x}, y${this.velocity.y}`);

        // set the aim to the current mouse pos
        // this.aim.x = canvas.mousePos.x;
        // this.aim.y = canvas.mousePos.y;

        // calculate the angle between the hamster and the mouse
        // this.direction = Math.atan2(this.aim.y - this.trueY - 10, this.aim.x - this.trueX - 10);    



        // center the camera on the hamster
        canvas.setCamera(this.trueX - canvas.width/2, this.trueY - canvas.height/2);

    }

    increaseVelocity(x) {
        this.velocity += x;
        if (this.velocity > this.maxVelocity) {
            this.velocity = this.maxVelocity;
        }
        
    }

    decreaseVelocity(x) {
        this.velocity -= x;
        if (this.velocity < 0) {
            this.velocity = 0;
        }
    }

    rotate(deg) {
        // positive is clockwise, negative is counterclockwise
        this.direction += deg * Math.PI / 180;
    }

    draw(canvas) {
        canvas.drawRect(this.trueX, this.trueY, 20, 20, "red");
        // draw the name above the hamster
        
        canvas.drawFont(this.name, this.trueX, this.trueY - 10, "white");
    }

    shoot(e) {
        // spawn a bullet pointing at the aim
        let bullet = new Bullet(this.direction, this.trueX + 10, this.trueY + 10, 50);
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

        kills++;
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
            if (this.hitbox.collides(hitboxes[i]) && hitboxes[i].owner != "bullet" && hitboxes[i].owner != "player") {
                // if the bullet has collided with a hitbox, remove the bullet and the hitbox
                bullets.splice(bullets.indexOf(this), 1);
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