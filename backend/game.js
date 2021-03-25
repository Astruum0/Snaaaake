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
        this.deadPlayers = {};
        this.winner = null;
    }

    update() {
        if (!this.winner) {
            for (var key in this.players) {
                this.players[key].update();
                if (this.players[key].eat_food(this.food)) {
                    this.food = new Food();
                    this.players[key].grow();
                }
                if (!this.players[key].immune &&
                    this.players[key].collide(this.players)
                ) {
                    this.players[key].hit();
                    this.players[key].setImmune(3);
                }
            }
        }
    }
    resetGame() {
        this.food = new Food();
        this.players = {};
        this.deadPlayers = {};
        this.winner = null;
    }

    setWinner(playerKey) {
        this.winner = this.players[playerKey];
        setTimeout(() => {
            this.resetGame();
        }, 3000);
    }

    deadSnakes() {
        var deadSnakesID = [];
        for (var key in this.players) {
            if (this.players[key].lives == 0) {
                deadSnakesID.push(key);
            }
        }
        return deadSnakesID;
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