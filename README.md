# Snaaaake

- Par Arthur Vella, Romain Ranaivoson et Mattéo Christophe

### Description

Jeu en ligne sur navigateur codé en Javacript jouable jusqu'à 4 dans un salon, possibilité de créer son propre salon privé et d'en rejoindre d'autres.

### Fonctionnement

Snaaaake fonctionne sur un serveur web hébergé dans une machine virtuelle Azure. Le nom de domaine snaaaake.com renvoie sur cette machine.

Système d'exploitation serveur : CentOS 7
Serveur web : Nginx
Système de conteneurisation et d'automatisation : Docker
Serveur local : NodeJS
Framework graphique : P5

Le système de salons fonctionne en exécutant un conteneur lors de la création d'un salon. Le conteneur prend en paramètre pour le name un identifiant aléatoire créé lors de la demande de création de serveur, et un port choisi arbitrairement entre 3001 et 3100.
Lors de la création d'un serveur public ou privé, une fonction de création sera soumise et une requête Redis sera envoyée pour demander à ajouter à la base de données les informations de serveur, à savoir l'ID et le port. Dans le même temps, un conteneur sera lancé à partir d'une image du jeu déjà créée vient un fichier `Dockerfile`.
Lorsqu'un utilisateur souhaitera rejoindre un salon en appuyant sur le bouton "Rejoindre", le salon le redirigera sur la page présentant le jeu avec les paramètres correspondant. Si le serveur 01 correspond à la partie 1 au port 3001, l'utilisateur sera redirigé sur la page `game.html` sur le port 3001.
Les ports différencient les différents salons.

![](https://i.imgur.com/FrBnj5G.png)


#### Installation

L'arborescence des fichiers est différente sur le site web et ne correspond pas à l'arborescence du jeu qui pourrait être lancé en local.

Sous Linux - Prérequis 

NodeJS (`sudo apt install nodejs npm`/`sudo pacman -S nodejs npm`)
Redis (`sudo apt install redis-server`/`sudo pacman -S redis-server` && `sudo systemctl start redis.service`)
Docker (`sudo apt install docker-ce docker-ce-cli containerd.io`/`sudo pacman -S docker && sudo systemctl start docker.service`)

Installation du jeu en local

1. Cloner le repo git (https://github.com/Astruum0/Snaaaake)
2. Se rendre dans le dossier `cd Snaaaake`
3. Effectuer la commande `npm install` pour installer toutes les dépendances
4. Se rendre dans le dossier backend/
5. Installer l'image docker avec `docker build -t snakefinal .`
6. Effectuer la commande `node redisServer.js` pour écouter les demandes de création de salon. Laisser le shell tourner
7. Effectuer la commande `npx http-server`. Dites oui pour installer le serveur web.
8. Se rendre sur `localhost:8080/frontend/index.html`
9. Profit !
