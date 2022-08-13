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
    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Drawing
    drawImg(img, x, y, w, h) {
        this.ctx.drawImage(img, x, y, w, h);
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

// Logo and opening
var logo = new Image();
logo.src = 'assets/byemclogo.png';
logo.onload = function() {
    canvas.drawImg(logo, 0, 0, 128, 128);
}
