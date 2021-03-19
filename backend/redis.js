const redis = require("redis");
const redisClient = redis.createClient();

// const io = require("socket.io")();

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

// setServerStatus("JzFad", false);
// getServerInfos("JzFad").then(console.log);
//console.log(createNewServer(3003));

deleteServer("8LP6L");
getAllServers().then(console.log);

//io.listen(3000);