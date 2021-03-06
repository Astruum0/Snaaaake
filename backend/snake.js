var win_size = 600;
var win_block_size = 60;
var start_length = 10;
var start_coords = [
    [1, 1, "Right"],
    [win_block_size - 2, 1, "Down"],
    [1, win_block_size - 2, "Up"],
    [win_block_size - 2, win_block_size - 2, "Left"],
];
var colors = ["#4ACA64", "#6E86FF", "#FF2E73", "#F7B053"];

class Snake {
    constructor(id, name, colorId) {
        this.id = id;
        this.name = name;
        this.block_size = win_size / win_block_size;
        this.composition = [
            [...start_coords[this.id]]
        ];
        for (var i = 0; i < start_length; i++) {
            this.composition.push([
                this.composition[0][0],
                this.composition[0][1],
                null,
            ]);
        }
        this.current_direction = start_coords[this.id][2];
        this.lives = 3;
        this.immune = false;
        this.color = colors[this.id];
    }

    updateId(id) {
        this.id = id;
        this.composition = [
            [...start_coords[this.id]]
        ];
        for (var i = 0; i < start_length; i++) {
            this.composition.push([
                this.composition[0][0],
                this.composition[0][1],
                null,
            ]);
        }
        this.current_direction = start_coords[this.id][2];
        this.color = colors[this.id];
    }

    update(win_size) {
        for (var i = this.composition.length - 1; i >= 0; i--) {
            if (this.composition[i][2] == "Up") {
                this.composition[i][1] -= 1;
                if (this.composition[i][1] < 0) {
                    this.composition[i][1] = win_block_size - 1;
                }
            }
            if (this.composition[i][2] == "Down") {
                this.composition[i][1] += 1;
                if (this.composition[i][1] > win_block_size - 1) {
                    this.composition[i][1] = 0;
                }
            }
            if (this.composition[i][2] == "Left") {
                this.composition[i][0] -= 1;
                if (this.composition[i][0] < 0) {
                    this.composition[i][0] = win_block_size - 1;
                }
            }
            if (this.composition[i][2] == "Right") {
                this.composition[i][0] += 1;
                if (this.composition[i][0] > win_block_size - 1) {
                    this.composition[i][0] = 0;
                }
            }
            if (i > 0) {
                this.composition[i][2] = this.composition[i - 1][2];
            }
        }
    }

    show() {
        fill(255);
        for (var i = 0; i < this.composition.length; i++) {
            var x = this.composition[i][0];
            var y = this.composition[i][1];
            rect(
                x * this.block_size,
                y * this.block_size,
                this.block_size,
                this.block_size
            );
        }
    }

    move(direction) {
        if (direction == "Up" && this.current_direction != "Down") {
            this.composition[0][2] = "Up";
            this.current_direction = "Up";
        }
        if (direction == "Down" && this.current_direction != "Up") {
            this.composition[0][2] = "Down";
            this.current_direction = "Down";
        }
        if (direction == "Left" && this.current_direction != "Right") {
            this.composition[0][2] = "Left";
            this.current_direction = "Left";
        }
        if (direction == "Right" && this.current_direction != "Left") {
            this.composition[0][2] = "Right";
            this.current_direction = "Right";
        }
    }

    eat_food(food) {
        return this.composition[0][0] == food.x && this.composition[0][1] == food.y;
    }

    collide(players) {
        for (var key in players) {
            if (players[key].id != this.id && !players[key].immune) {
                for (var j = 0; j < players[key].composition.length; j++) {
                    if (
                        this.composition[0][0] == players[key].composition[j][0] &&
                        this.composition[0][1] == players[key].composition[j][1]
                    ) {
                        return true;
                    }
                }
            }
        }
        for (var i = 1; i < this.composition.length; i++) {
            if (
                this.composition[0][0] == this.composition[i][0] &&
                this.composition[0][1] == this.composition[i][1]
            ) {
                return true;
            }
        }
        return false;
    }

    grow() {
        var new_block = [
            this.composition[this.composition.length - 1][0],
            this.composition[this.composition.length - 1][1],
            null,
        ];
        this.composition.push(new_block);
    }

    hit() {
        this.lives = this.lives > 1 ? this.lives - 1 : 0;
    }

    setImmune(sc) {
        this.immune = true;
        setTimeout(() => {
            this.immune = false;
        }, sc * 1000);
    }
}

module.exports = {
    Snake,
};