const port = 3003;

const io = require("socket.io")();
const { Game, Food, createRandomID } = require("./game");
const { Snake } = require("./snake");

const FPS = 30;
const game = new Game();
var users = {};
var serverID;

var gameStarted = false;

io.on("connection", (client) => {
    var id = createRandomID();
    users[id] = client;

    client.emit("init", {
        content: "Connected to the server",
        id: gameStarted || Object.keys(game.players).length == 4 ? "spec" : id,
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
            var currentDeadSnakesID = game.deadSnakes();
            for (var i = 0; i < currentDeadSnakesID.length; i++) {
                users[currentDeadSnakesID[i]].emit("dead");
                game.deadPlayers[currentDeadSnakesID[i]] =
                    game.players[currentDeadSnakesID[i]];
                delete game.players[currentDeadSnakesID[i]];
            }
        }
        if (Object.keys(game.players).length == 1 && !game.winner) {
            for (key in game.players) {
                gameStarted = false;
                game.setWinner(key);
                setTimeout(() => {
                    setServerStatus(serverID, false);
                    for (var key in users) {
                        users[key].emit("refresh");
                    }
                }, 3000);
                clearInterval(loop);
                break;
            }
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
            if (gameStarted) {
                game.deadPlayers[clientID] = game.players[clientID];
            }

            delete users[clientID];
            delete game.players[clientID];

            if (!gameStarted) {
                var i = 0;
                for (key in game.players) {
                    game.players[key].updateId(i);
                    i++;
                }
            }
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
    if (Object.keys(game.players).length > 1) {
        if (!gameStarted) {
            gameLoop();
        }
        gameStarted = true;
    }
}

io.listen(port);