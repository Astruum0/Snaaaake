var autoRefresh = setInterval(() => {
    for (key in currentState.players) {
        id = currentState.players[key].id;
        lives = currentState.players[key].lives;
        name = currentState.players[key].name;
        Pcolor = currentState.players[key].color;
        document.getElementById("heart" + id).src =
            "../assets/" + lives + "_live.png";
        document.getElementById("username" + id).innerHTML = name;
        document.getElementById("username" + id).style.color = Pcolor;
    }
    for (key in currentState.deadPlayers) {
        id = currentState.deadPlayers[key].id;
        lives = currentState.deadPlayers[key].lives;
        name = currentState.deadPlayers[key].name;
        Pcolor = currentState.deadPlayers[key].color;
        document.getElementById("heart" + id).style.display = "none";
        document.getElementById("username" + id).innerHTML = name;
        document.getElementById("username" + id).style.color = Pcolor;
        card = document.getElementById("player" + (id + 1));
        card.classList.add("bg-dead");
    }
    num_player =
        Object.keys(currentState.players).length +
        Object.keys(currentState.deadPlayers).length;
    for (i = 4; i > num_player; i--) {
        document.getElementById("player" + i).style.display = "none";
    }
    for (i = 1; i <= num_player; i++) {
        document.getElementById("player" + i).style.display = "block";
    }
}, 100);
