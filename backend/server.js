const io = require("socket.io")();
const { Game, Food, createRandomID } = require("./game");
const { Snake } = require("./snake");

const FPS = 30;
const game = new Game();
var users = {};

var gameStarted = false;

io.on("connection", (client) => {
    var id = createRandomID();
    users[id] = client;

    client.emit("init", {
        content: "Connected to the server",
        id: gameStarted ? "spec" : id,
    });
    if (!gameStarted) {
        client.on("addSnake", (data) => {
            game.players[id] = new Snake(
                Object.keys(game.players).length,
                data.pseudo
            );
        });
        client.on("move", moveSnake);
        client.on("gameStart", startGame);
    }
    client.emit("gameUpdate", JSON.stringify(game));
    clientLoop(id);
});

function gameLoop() {
    var loop = setInterval(() => {
        if (gameStarted) {
            game.update();
        }
        if (Object.keys(users).length == 0) {
            gameStarted = false;
            clearInterval(loop);
        }
    }, 1000 / FPS);
}

function clientLoop(clientID) {
    var clientloop = setInterval(() => {
        if (users[clientID].disconnected) {
            delete users[clientID];
            delete game.players[clientID];
            clearInterval(clientloop);
            return;
        }
        users[clientID].emit("gameUpdate", JSON.stringify(game));
    }, 1000 / FPS);
}

function moveSnake(data) {
    game.players[data.playerID].move(data.direction);
}

function startGame() {
    if (!gameStarted) {
        gameLoop();
    }
    gameStarted = true;
}

io.listen(3000);