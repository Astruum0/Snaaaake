var redisSocket = io("http://www.snaaaake.com:3000");
var serversStates = null;
redisSocket.on("getAllServers", (servers) => {
    console.log(servers);
    serversStates = servers;
    refresh();
});
redisSocket.emit("getAllServers");
var private_serv = 0;

redisSocket.on("redirect", (id) => {
    if (id) {
        window.location.href = "game.html?id=" + id + "&username=" + document.getElementById("username").value;
    } else {
        window.location.href = "index.html";
    }
});

function clear() {
    for (i = 0; i <= Math.ceil(serversStates.length / 4); i++) {
        var card_deck = document.getElementById("server" + i);
        if (typeof card_deck != "undefined" && card_deck != null) {
            card_deck.remove();
        }
    }
}

function refresh() {
    clear();
    private_serv = 0;
    container = document.getElementById("container");
    for (i = 0; i < Math.ceil(serversStates.length / 4); i++) {
        var card_deck = document.createElement("div");
        card_deck.classList.add("card-deck");
        card_deck.id = "server" + i;
        container.appendChild(card_deck);
    }

    for (i = 0; i < serversStates.length; i++) {
        if (!serversStates[i].private) {
            index = i - private_serv;
            var id = serversStates[i].id;
            var server = document.getElementById("server" + Math.floor(index / 4));
            if (serversStates[i].playing) {
                var game_status = "En jeu";
                var game_status_color = "bg-danger";
                var game_button = "Regarder";
                var game_button_class = "btn-secondary";
            } else if (serversStates[i].players == 4) {
                var game_status = "Complet";
                var game_status_color = "bg-secondary";
                var game_button = "Regarder";
                var game_button_class = "btn-light";
            } else {
                var game_status = "En attente";
                var game_status_color = "bg-success";
                var game_button = "Rejoindre";
                var game_button_class = "btn-primary";
            }

            var card = document.createElement("div");
            card.classList.add("card", "text-white", game_status_color, "mb-3");
            card.style.maxWidth = "20rem";

            var header = document.createElement("div");
            header.classList.add("card-header");
            header.innerHTML = "Serveur " + (i + 1);
            var body = document.createElement("div");
            body.classList.add("card-body");

            var title = document.createElement("div");
            title.classList.add("card-title");
            title.innerHTML = serversStates[i].players + "/4 joueurs";
            var status = document.createElement("p");
            status.classList.add("card-text");
            status.innerHTML = "Status : " + game_status;

            var button = document.createElement("button");
            var username = document.getElementById("username").value;

            if (username != "") {
                var link = document.createElement("a");
                link.href = "game.html?id=" + id + "&username=" + username;
                body.appendChild(link);
                link.appendChild(button);
            } else {
                button.addEventListener("click", function () {
                    error_div = document.createElement("div");
                    error_div.innerText = "Veuillez choisir un pseudo";
                    error_div.classList.add("alert");
                    error_div.classList.add("alert-danger");
                    error_div.classList.add("login-err");
                    $(error_div)
                        .hide()
                        .appendTo(document.getElementById("error_div"))
                        .fadeIn(500);
                    setTimeout(function () {
                        $(error_div).fadeOut(500, function () {
                            $(this).remove();
                        });
                    }, 3000);
                });
                body.appendChild(button);
            }
            button.classList.add(
                "btn",
                game_button_class,
                "btn-sm",
                "btn-lg",
                "rounded",
                "float-sm-right"
            );
            button.innerHTML = game_button;

            server.appendChild(card);
            card.appendChild(header);
            card.appendChild(body);
            body.appendChild(title);
            body.appendChild(status);
        } else {
            private_serv += 1;
        }
    }
}

function errorDiv() {
    error_div = document.createElement("div")
    error_div.innerText = "Veuillez choisir un pseudo"
    error_div.classList.add("alert")
    error_div.classList.add("alert-danger")
    error_div.classList.add("login-err")
    $(error_div).hide().appendTo(document.getElementById("error_div")).fadeIn(500);
    setTimeout(function () {
        $(error_div).fadeOut(500, function () { $(this).remove() })
    }, 3000)
}

function createNewServer(private = true) {
    var username = document.getElementById("username").value
    if (username == "") {
        errorDiv();
    } else {
        redisSocket.emit("createNewServer", private);
    }
}

function getserv() {
    redisSocket.emit("getAllServers");
}
