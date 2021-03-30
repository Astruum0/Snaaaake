const {
  setServerStatus,
  setServerPlayers,
  _,
  getAllServers,
  getServerInfos,
  createNewServer,
} = require("./redisLocal.js");

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

          const { writeFileSync } = require('fs');

          writeFileSync('/usr/share/nginx/html/Snaaaake/backend/txt/port.txt', currentPort)
          writeFileSync('/usr/share/nginx/html/Snaaaake/backend/txt/serverID.txt', serverId)

          exec(
            "docker run -itdv /usr/share/nginx/html/Snaaaake/backend/txt/.:/usr/src/app/txt/ --name " +
            serverId +
            " -dp " +
            currentPort +
            ":3000 snakefinal"
          );
        }
        client.emit("redirect", serverId);

        break;
      }
    });
  });
});
io.listen(3000);
