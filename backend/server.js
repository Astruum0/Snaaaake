const port = 3001;

const io = require("socket.io")();
const { Game, Food, createRandomID } = require("./game");
const { Snake } = require("./snake");
const {
    setServerStatus,
    setServerPlayers,
    getServerIDFromPort,
} = require("./redis.js");

const FPS = 30;
const game = new Game();
var users = {};
var serverID;
getServerIDFromPort(port).then((id) => {
    serverID = id;
    console.log(serverID);
});

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
            setServerPlayers(serverID, Object.keys(game.players).length);
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
                setServerStatus(serverID, false);
                game.setWinner(key);
                clearInterval(loop);
                break;
            }
        }
        if (Object.keys(users).length == 0) {
            gameStarted = false;
            setServerStatus(serverID, false);
            clearInterval(loop);
        }
    }, 1000 / FPS);
}

function clientLoop(clientID) {
    var clientloop = setInterval(() => {
        if (users[clientID].disconnected) {
            delete users[clientID];
            delete game.players[clientID];

            if (!gameStarted) {
                var i = 0;
                for (key in game.players) {
                    game.players[key].updateId(i);
                    i++;
                }
            }

            setServerPlayers(serverID, Object.keys(game.players).length);
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
        setServerStatus(serverID, true);
    }
}

io.listen(port);