const {
    setServerStatus,
    setServerPlayers,
    _,
    getAllServers,
    getServerInfos,
} = require("./redis.js");

const io = require("socket.io")();

io.on("connection", (client) => {
    // client.on("getAllServers", () => {
    //     getAllServers().then((servers) => {
    //         client.emit("getAllServers", servers);
    //     });
    // });
    client.on("getAllServers", () => {
        servers = [{
                id: '2ROhr',
                port: 3001,
                players: 3,
                playing: true,
                private: true
            },
            {
                id: 'lSWDh',
                port: 3002,
                players: 0,
                playing: false,
                private: true
            }
        ]
        client.emit("getAllServers", servers);
    });
    client.on("sendID", (id) => {
        getServerInfos(id).then((server) => {
            client.emit("getPortFromID", server.port);
        });
    });
});

<<
<< << < HEAD
    ===
    === =


    >>>
    >>> > Matteo
io.listen(3000);