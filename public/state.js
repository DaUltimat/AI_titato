class Game {
    constructor() {
        this.cross = Math.floor(Math.random() * 2); // says whether the player is playing cross
        this.move = this.cross; // 0 = was BOTS move when made position, 1 = was PLAYERS move when made position
        this.states = [new GameState(new Uint32Array(1), this.move)];

        this.square_size = 120;

        this.draw_grid();
        this.update_move_banner();
    }

    play_move(tile) {
        let grid = this.states[this.states.length - 1].grid;
        let filled = Bit.get(grid, tile);
        if(!filled) {
            let a = Bit.set(grid, tile);
            if(this.move) {
                a = Bit.set(a, tile + 9);
            }
            let next_move = (-this.move + 1) % 2;
            this.states.push(new GameState(a, next_move));
            this.move = next_move;
        } else alert("That tile is already full");

        this.render();
        this.update_move_banner();
    }

    render() {
        let grid = this.states[this.states.length - 1].grid;
        for(var i = 0; i < 9; i += 1) {
            if(Bit.get(grid, i)) {
                this.draw_shapes(Bit.get(grid, i + 9), (i % 3), Math.floor(i / 3));
            }
        }
    }

    draw_grid() {
        for(var i = 1; i < 3; i += 1) {
            c.fillRect(0, i * 120 - 2, 360, 4);
        }

        for(var j = 1; j < 3; j += 1) {
            c.fillRect(j * 120 - 2, 0, 4, 360);
        }
    }

    draw_shapes(shape, row, col) {
        c.fillStyle = "black";
        if(shape == 0) {
            c.beginPath();
            c.arc(row * 120 + 60, col * 120 + 60, 50, 0, 2 * Math.PI);
            c.fill();
        } else if(shape == 1) {
            c.lineWidth = 20;
            let x = row * 120 + 60;
            let y = col * 120 + 60;
            c.beginPath();
            c.moveTo(x - 40, y - 40);
            c.lineTo(x + 40, y + 40);
            c.stroke();

            c.beginPath();
            c.moveTo(x + 40, y - 40);
            c.lineTo(x - 40, y + 40);
            c.stroke();
        } else alert("Shape number does not exist");
    }

    update_move_banner() {
        document.querySelector("#whos_move").innerHTML = this.move ? "Bots" : "Yours";
    }
}

class GameState {
    constructor(grid, move) {
        this.grid = grid;
        this.move = move; // 0 = was BOTS move after position, 1 = was PLAYERS move after position
        this.won = false;
        this.children = [];
    }
}