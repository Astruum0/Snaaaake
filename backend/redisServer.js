const { getAllServers, getServerInfos } = require("./redis.js");
const { writeFileSync } = require("fs");
const io = require("socket.io")();

io.on("connection", (client) => {
    client.on("getAllServers", () => {
        getAllServers().then((servers) => {
            client.emit("getAllServers", servers);
        });
    });
    client.on("sendID", (id) => {
        getServerInfos(id).then((server) => {
            if (server == "error") {
                client.emit("redirect");
            } else {
                client.emit("getPortFromID", server.port);
            }
        });
    });
    client.on("createNewServer", (private) => {
        getAllServers().then((servers) => {
            usedPorts = [];
            for (var i = 0; i < servers.length; i++) {
                usedPorts.push(servers[i].port);
            }
            for (var currentPort = 3001; currentPort < 3100; currentPort++) {
                if (!usedPorts.includes(currentPort)) {
                    var serverId = createNewServer(currentPort, private);
                    //Creation Docker
                    const { exec } = require("child_process");

                    writeFileSync("port", currentPort);
                    exec(
                        "docker run --name " +
                        serverId +
                        " -dp " +
                        currentPort +
                        ":3000 snakefinal"
                    );
                    client.emit("redirect", serverId);

                    break;
                }
            }
        });
    });
});
io.listen(3000);