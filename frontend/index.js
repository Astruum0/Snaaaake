const serversStates = [
    {
    id: 1,
    players: 2,
    playing: false
    },
    {
    id: 2,
    players: 4,
    playing: true
    }, 
    {
    id: 3,
    players: 3,
    playing: true
    },
    {
    id: 4,
    players: 1,
    playing: false
    }, 
    {
    id: 5,
    players: 4,
    playing: true
    },
    {
    id: 6,
    players: 3,
    playing: false
    }, 
];

function clear(){
    for (i = 0; i <= Math.ceil(serversStates.length / 4); i++) {
        console.log(i)
        var card_deck = document.getElementById("server" + i)
        if (typeof(card_deck) != 'undefined' && card_deck != null){
            card_deck.remove()
        }
    }
}


function refresh() {
    clear()
    container = document.getElementById("container")
    for (i = 0; i < Math.ceil(serversStates.length / 4); i++) {
        var card_deck = document.createElement("div")
        card_deck.classList.add("card-deck")
        card_deck.id = "server" + i
        container.appendChild(card_deck)
    }

    for (i = 0; i <= serversStates.length; i++) {
        var server = document.getElementById("server" + Math.floor(i / 4))
        if (serversStates[i].playing){
            var game_status = "En jeu"
            var game_status_color = "bg-danger"
        } else {
            var game_status = "En attente"
            var game_status_color = "bg-success"
        }

        var card = document.createElement("div")
        card.classList.add("card", "text-white", game_status_color, "mb-3")
        card.style.maxWidth = "20rem"

        var header = document.createElement("div")
        header.classList.add("card-header")
        header.innerHTML = "Serveur " + serversStates[i].id

        var body = document.createElement("div")
        body.classList.add("card-body")
    
        var title = document.createElement("div")
        title.classList.add("card-title")
        title.innerHTML = serversStates[i].players + "/4 joueurs"
        var status = document.createElement("p")
        status.classList.add("card-text")
        status.innerHTML = "Status : " + game_status

        var button = document.createElement("button")
        button.classList.add("btn", "btn-primary", "btn-sm", "btn-lg", "rounded", "float-sm-right")
        button.innerHTML = "Rejoindre"

        server.appendChild(card)
        card.appendChild(header)
        card.appendChild(body)
        body.appendChild(title)
        body.appendChild(status)
        status.appendChild(button)
    }
}
