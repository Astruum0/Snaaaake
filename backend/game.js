const { Snake } = require("./snake");

var FPS = 30;
var WIN_SIZE = 600;
var win_block_size = 60;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Food {
    constructor() {
        this.x = getRandomInt(win_block_size - 1);
        this.y = getRandomInt(win_block_size - 1);
        this.size = WIN_SIZE / win_block_size;
    }
}

class Game {
    constructor() {
            this.food = new Food();
            this.players = {};
            // this.addplayers();
        }
        // addplayers() {
        //     this.players = [
        //         new Snake(0, "Astruum", WIN_SIZE),
        //         new Snake(1, "B", WIN_SIZE),
        //         new Snake(2, "C", WIN_SIZE),
        //         new Snake(3, "D", WIN_SIZE),
        //     ];
        // }

    update() {
        for (var key in this.players) {
            this.players[key].update();
            if (this.players[key].eat_food(this.food)) {
                this.food = new Food();
                this.players[key].grow();
            }
            if (this.players[key].collide_with_others(this.players)) {
                // console.log(this.players[i].id, "ouch");
            }
        }
    }
}

function createRandomID() {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    Game,
    Food,
    createRandomID,
};