const {
    setServerStatus,
    setServerPlayers,
    _,
    getAllServers,
} = require("./redis.js");

const io = require("socket.io")();

io.on("connection", (client) => {
    client.on("getAllServers", () => {
        getAllServers().then((servers) => {
            client.emit("getAllServers", servers);
        });
    });
});
io.listen(3000);