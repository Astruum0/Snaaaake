function drawState(state, sprites, count) {
    // Food
    fill(255, 0, 0);
    image(
        sprites.food,
        state.food.x * state.food.size,
        state.food.y * state.food.size
    );

    // Players
    var i = 0;
    for (var key in state.players) {
        fill(255);
        for (var j = 0; j < state.players[key].composition.length; j++) {
            var x = state.players[key].composition[j][0];
            var y = state.players[key].composition[j][1];

            var sprite = spritesData.head.down[i];
            switch (j) {
                case 0:
                    switch (state.players[key].composition[j][2]) {
                        case "Up":
                            sprite = spritesData.head.up[i];
                            break;
                        case "Down":
                            sprite = spritesData.head.down[i];
                            break;
                        case "Left":
                            sprite = spritesData.head.left[i];
                            break;
                        case "Right":
                            sprite = spritesData.head.right[i];
                            break;
                    }
                    break;
                case state.players[key].composition.length - 1:
                    switch (state.players[key].composition[j][2]) {
                        case "Up":
                            sprite = spritesData.tail.down[i];
                            break;
                        case "Down":
                            sprite = spritesData.tail.up[i];
                            break;
                        case "Left":
                            sprite = spritesData.tail.right[i];
                            break;
                        case "Right":
                            sprite = spritesData.tail.left[i];
                            break;
                    }
                    break;
                default:
                    switch (state.players[key].composition[j][2]) {
                        case "Up":
                        case "Down":
                            if (
                                state.players[key].composition[j][2] == "Up" &&
                                state.players[key].composition[j + 1][2] == "Left"
                            ) {
                                sprite = spritesData.body.U_R[i];
                            } else if (
                                state.players[key].composition[j][2] == "Up" &&
                                state.players[key].composition[j + 1][2] == "Right"
                            ) {
                                sprite = spritesData.body.U_L[i];
                            } else if (
                                state.players[key].composition[j][2] == "Down" &&
                                state.players[key].composition[j + 1][2] == "Left"
                            ) {
                                sprite = spritesData.body.D_R[i];
                            } else if (
                                state.players[key].composition[j][2] == "Down" &&
                                state.players[key].composition[j + 1][2] == "Right"
                            ) {
                                sprite = spritesData.body.D_L[i];
                            } else {
                                sprite = spritesData.body.U_D[i];
                            }

                            break;
                        case "Left":
                        case "Right":
                            if (
                                state.players[key].composition[j][2] == "Left" &&
                                state.players[key].composition[j + 1][2] == "Up"
                            ) {
                                sprite = spritesData.body.D_L[i];
                            } else if (
                                state.players[key].composition[j][2] == "Left" &&
                                state.players[key].composition[j + 1][2] == "Down"
                            ) {
                                sprite = spritesData.body.U_L[i];
                            } else if (
                                state.players[key].composition[j][2] == "Right" &&
                                state.players[key].composition[j + 1][2] == "Up"
                            ) {
                                sprite = spritesData.body.D_R[i];
                            } else if (
                                state.players[key].composition[j][2] == "Right" &&
                                state.players[key].composition[j + 1][2] == "Down"
                            ) {
                                sprite = spritesData.body.U_R[i];
                            } else {
                                sprite = spritesData.body.L_R[i];
                            }
                            break;
                    }
            }
            image(
                sprite,
                x * state.players[key].block_size,
                y * state.players[key].block_size
            );
        }
        i++;
    }
}

function createSpriteData(spritesheet) {
    var spriteData = {
        head: {
            up: [],
            down: [],
            left: [],
            right: [],
        },
        body: {
            U_D: [],
            L_R: [],
            U_L: [],
            U_R: [],
            D_L: [],
            D_R: [],
        },
        tail: {
            up: [],
            down: [],
            left: [],
            right: [],
        },
    };
    spritesheet.resize(200, 40);
    spriteData.food = spritesheet.get(0, 30, 10, 10);
    for (var offset = 0; offset < 200; offset += 50) {
        spriteData.head.up.push(spritesheet.get(30 + offset, 0, 10, 10));
        spriteData.head.down.push(spritesheet.get(40 + offset, 10, 10, 10));
        spriteData.head.left.push(spritesheet.get(30 + offset, 10, 10, 10));
        spriteData.head.right.push(spritesheet.get(40 + offset, 0, 10, 10));

        spriteData.body.U_D.push(spritesheet.get(20 + offset, 10, 10, 10));
        spriteData.body.L_R.push(spritesheet.get(10 + offset, 0, 10, 10));
        spriteData.body.U_L.push(spritesheet.get(20 + offset, 20, 10, 10));
        spriteData.body.U_R.push(spritesheet.get(0 + offset, 10, 10, 10));
        spriteData.body.D_L.push(spritesheet.get(20 + offset, 0, 10, 10));
        spriteData.body.D_R.push(spritesheet.get(0 + offset, 0, 10, 10));

        spriteData.tail.up.push(spritesheet.get(40 + offset, 30, 10, 10));
        spriteData.tail.down.push(spritesheet.get(30 + offset, 20, 10, 10));
        spriteData.tail.left.push(spritesheet.get(40 + offset, 20, 10, 10));
        spriteData.tail.right.push(spritesheet.get(30 + offset, 30, 10, 10));
    }
    return spriteData;
}