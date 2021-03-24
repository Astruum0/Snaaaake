const {
    setServerStatus,
    setServerPlayers,
    _,
    getAllServers,
    getServerInfos,
} = require("./redis.js");

const io = require("socket.io")();

io.on("connection", (client) => {
    client.on("getAllServers", () => {
        getAllServers().then((servers) => {
            client.emit("getAllServers", servers);
        });
    });
    client.on("sendID", (id) => {
        getServerInfos(id).then((server) => {
            client.emit("getPortFromID", server.port);
        });
    });
});
io.listen(3000);