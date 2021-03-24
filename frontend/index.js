var redisSocket = io("http://localhost:3000");
var serversStates = null;
redisSocket.on("getAllServers", (servers) => {
    console.log(servers);
    serversStates = servers;
    refresh();
});
redisSocket.emit("getAllServers");

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
    container = document.getElementById("container");

    for (i = 0; i < serversStates.length; i++) {
        if (!serversStates[i].private) {
            var card_deck = document.createElement("div");
            card_deck.classList.add("card-deck");
            card_deck.id = "server" + i;
            container.appendChild(card_deck);
            var server = document.getElementById("server" + Math.floor(i / 4));
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

            var form = document.createElement("a");
            form.setAttribute(
                "href",
                "game.html?id=" + serversStates[i].id + "&username=" + "Matteo"
            );

            var button = document.createElement("button");
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
            status.appendChild(form);
            form.appendChild(button);
        }
    }
}

function createNewServer(private) {
    redisSocket.emit("createNewServer", private);
}

function getserv() {
    redisSocket.emit("getAllServers");
}