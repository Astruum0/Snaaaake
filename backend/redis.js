const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function(error) {
    console.error(error);
});

const generateNewId = (length) => {
    var res = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
};

const getAllServers = () => {
    return new Promise((resolve, reject) => {
        redisClient.SMEMBERS("serverList", (err, serverNames) => {
            if (err) {
                reject(err);
            }

            allPromises = [];
            for (var i = 0; i < serverNames.length; i++) {
                allPromises.push(
                    new Promise((resolve, _) => {
                        redisClient.HGETALL(serverNames[i], (_, res) => {
                            res.port = parseInt(res.port);
                            res.players = parseInt(res.players);
                            res.playing = res.playing == "true";
                            res.private = res.private == "true";
                            resolve(res);
                        });
                    })
                );
            }
            Promise.all(allPromises).then((allServers) => {
                resolve(allServers);
            });
        });
    });
};
const getServerInfos = (id) => {
    return new Promise((resolve, reject) => {
        redisClient.HGETALL(id, (err, res) => {
            res.port = parseInt(res.port);
            res.players = parseInt(res.players);
            res.playing = res.playing == "true";
            res.private = res.private == "true";
            resolve(res);
        });
    });
};
const setServerStatus = (id, status) => {
    redisClient.HSET(id, "playing", status);
};
const setServerPlayers = (id, nbr) => {
    redisClient.HSET(id, "players", nbr);
};

const createNewServer = (port, private = true) => {
    var id = generateNewId(5);

    redisClient.HSET(
        id,
        "id",
        id,
        "port",
        port,
        "players",
        0,
        "playing",
        false,
        "private",
        private
    );
    redisClient.SADD("serverList", id);

    return id;
};

const deleteServer = (id) => {
    redisClient.SREM("serverList", id);
    redisClient.DEL(id);
};

const getServerIDFromPort = (port) => {
    return new Promise((resolve, reject) => {
        getAllServers().then((servers) => {
            for (var i = 0; i < servers.length; i++) {
                if (servers[i].port == port) {
                    resolve(servers[i].id);
                }
            }
            reject("Error - Invalid port");
        });
    });
};

module.exports = {
    setServerStatus,
    setServerPlayers,
    getServerIDFromPort,
    getAllServers,
    getServerInfos,
    createNewServer,
};