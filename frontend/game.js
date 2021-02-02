var FPS = 30;
var WIN_SIZE = 600;
var win_block_size = 60;

class Food {
    constructor() {
        this.x = Math.round(random(win_block_size - 1));
        this.y = Math.round(random(win_block_size - 1));
        this.size = WIN_SIZE / win_block_size;
    }
    show() {
        fill(255, 0, 0);
        rect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
}

var food;
var players;

function setup() {
    createCanvas(WIN_SIZE, WIN_SIZE);
    frameRate(FPS);
    food = new Food();
    players = [
        new Snake(0, "Astruum", WIN_SIZE),
        new Snake(1, "Astruum", WIN_SIZE),
        new Snake(2, "Astruum", WIN_SIZE),
        new Snake(3, "Astruum", WIN_SIZE),
    ];
}

function draw() {
    background(0);
    food.show();
    for (var i = 0; i < players.length; i++) {
        players[i].update(WIN_SIZE);
        players[i].show();
    }
    update();
}

function update() {
    for (var i = 0; i < players.length; i++) {
        if (players[i].eat_food(food)) {
            food = new Food();
            players[i].grow();
        }
        if (players[i].collide_with_others(players)) {
            console.log(players[i].id, "ouch");
        }
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        players[0].move("Up");
    } else if (keyCode === DOWN_ARROW) {
        players[0].move("Down");
    } else if (keyCode === LEFT_ARROW) {
        players[0].move("Left");
    } else if (keyCode === RIGHT_ARROW) {
        players[0].move("Right");
    }
}