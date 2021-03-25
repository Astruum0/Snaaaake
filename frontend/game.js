var socket;
var redisSocket = io("http://localhost:3000");

var WIN_SIZE = 600;
var FPS = 30;
var currentState;
var playerID;
var spec = false;
var spritesheet;
var spritesData;
var port = 3001;

window.addEventListener(
    "keydown",
    function(e) {
        if (
            ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
                e.code
            ) > -1
        ) {
            e.preventDefault();
        }
    },
    false
);

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function(item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

redisSocket.on("getPortFromID", (port) => {
    socket = io("http://localhost:" + port);
    socket.on("init", (msg) => {
        console.log(msg.content);
        playerID = msg.id;
        playerName = findGetParameter("username");
        if (playerID == "spec") {
            spec = true;
        }
        if (!spec) {
            socket.emit("addSnake", {
                pseudo: playerName ? playerName : "Player",
                id: playerID,
            });
        }
    });
    socket.on("gameUpdate", (data) => {
        currentState = JSON.parse(data);
    });
    socket.on("dead", () => {
        playerID = "spec";
        console.log("DEAD");
    });
    socket.on("refresh", () => {
        document.location.reload();
    });
});

redisSocket.on("redirect", (id) => {
    if (id) {
        window.location.href = "http://127.0.0.1:5500/frontend/game.html + id";
    } else {
        window.location.href = "http://127.0.0.1:5500/frontend/index.html";
    }
});

var id = findGetParameter("id");
var username = findGetParameter("username");
if (!id) {
    window.location.href = "http://127.0.0.1:5500/frontend/index.html";
} else if (!username) {
    window.location.href = "http://127.0.0.1:5500/frontend/join.html?id=" + id;
} else {
    redisSocket.emit("sendID", id);
}

redisSocket.on("getAllServers", (servers) => {
    console.log(servers);
});

function preload() {
    spritesheet = loadImage("spritesheet.png");
}

function setup() {
    frameRate(FPS);
    createCanvas(WIN_SIZE, WIN_SIZE);
    spritesData = createSpriteData(spritesheet);

    document.getElementById("inputField").value = "snaaaake.com/game?id=" + id;
}

function copyToClipboard() {
    var gameLink = document.getElementById("inputField");
    gameLink.select();
    gameLink.setSelectionRange(0, 99999);
    document.execCommand("copy");

    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = "Copied to clipboard !";
}

function mouseOut() {
    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = "Copy to clipboard";
}

function draw() {
    background(0);
    if (currentState) {
        drawState(currentState, spritesData, frameCount % 16);
    }
}

function keyPressed() {
    if (playerID != "spec") {
        if (keyCode === UP_ARROW) {
            socket.emit("move", { playerID: playerID, direction: "Up" });
        } else if (keyCode === DOWN_ARROW) {
            socket.emit("move", { playerID: playerID, direction: "Down" });
        } else if (keyCode === LEFT_ARROW) {
            socket.emit("move", { playerID: playerID, direction: "Left" });
        } else if (keyCode === RIGHT_ARROW) {
            socket.emit("move", { playerID: playerID, direction: "Right" });
        } else if (keyCode === 32) {
            socket.emit("gameStart", 1);
        }
    }
}