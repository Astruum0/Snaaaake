var socket = io("http://localhost:3000");
var WIN_SIZE = 600;
var FPS = 30;
var currentState;
var playerID;
var spec = false;
var spritesheet;
var spritesData;

socket.on("init", (msg) => {
    console.log(msg.content);
    playerID = msg.id;
    if (playerID == "spec") {
        spec = true;
    }
    if (!spec) {
        socket.emit("addSnake", { pseudo: "Player " + playerID, id: playerID });
    }
});
socket.on("gameUpdate", (data) => {
    currentState = JSON.parse(data);
});
socket.on("dead", () => {
    playerID = "spec";
    console.log("DEAD");
});

function preload() {
    spritesheet = loadImage("spritesheet.png");
}

function setup() {
    frameRate(FPS);
    createCanvas(WIN_SIZE, WIN_SIZE);
    spritesData = createSpriteData(spritesheet);
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