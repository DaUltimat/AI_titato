class Game {
    constructor() {
        this.root_node = new Node(null, null, 0, true);
        this.start = Math.floor(Math.random() * 2) ? "O" : "X";
        this.root_node.calculate_all_nodes(this.start);
        this.move_cache = [];
        this.current_node = this.root_node;

        if (this.start == "O") {
            this.get_moves(Math.floor(Math.random() * 9));
        }

        this.render_shapes(this.current_node.position);
    }

    get_moves(square) {
        for (var i = 0; i < this.current_node.nodes.length; i += 1) {
            let node = this.current_node.nodes[i];
            if (node.square != null && node.square == square) {
                this.current_node = this.current_node.nodes[i];
                this.move_cache.push(square);

                let childValues = this.current_node.nodes.map(n => n.value);
                if (childValues.length === 0) {
                    return { nodes: [], desired: null };
                }

                let best;
                if (this.current_node.move) {
                    best = Math.max(...childValues);
                } else {
                    best = Math.min(...childValues);
                }

                let best_nodes = this.current_node.nodes.filter(n => n.value === best);
                return { nodes: best_nodes, desired: best };
            }
        }

        if (this.current_node.nodes.length == 0) {
            alert("Game ended");
        }
    }

    make_move(square) {
        let moves = this.get_moves(square);
        this.render_shapes(this.current_node.position);

        if (!moves || !moves.nodes || moves.nodes.length === 0) {
            alert("This is the end");
            return;
        }

        let desired = moves.desired;
        let best_score = -Infinity;

        const scored = moves.nodes.map(node => {
            let winsForDesired = 1;
            if (desired === 1) winsForDesired = node.possible_wins_till_now.max || 1;
            else if (desired === -1) winsForDesired = node.possible_wins_till_now.min || 1;
            else winsForDesired = 1;

            const score = node.possible_moves_till_now / winsForDesired;
            return { node, score };
        });

        scored.forEach(s => { if (s.score > best_score) best_score = s.score; });

        const tied = scored.filter(s => s.score === best_score).map(s => s.node);
        const chosen = tied[Math.floor(Math.random() * tied.length)];

        console.log("Chosen node:", chosen);
        this.get_moves(chosen.square);
    }

    register_move(tile) {
        this.make_move(tile);
        this.render_shapes(this.current_node.position);
    }

    render_lines() {
        c.fillStyle = "black";
        for (var i = 0; i < 2; i += 1) {
            c.fillRect(0, (i + 1) * 120 - 2.5, 360, 5);
        }

        for (var j = 0; j < 2; j += 1) {
            c.fillRect((j + 1) * 120 - 2.5, 0, 5, 360);
        }
    }

    render_shapes(position) {
        // position: string of length 9, characters "X", "O" or "#" for empty.
        const pos = position || (this.current_node && this.current_node.position);
        if (!pos || pos.length !== 9) {
            console.warn("render_shapes: invalid position:", position);
            return;
        }

        // Clear canvas using the 2D context's canvas reference
        const canvasEl = c && c.canvas ? c.canvas : null;
        if (!canvasEl) {
            console.warn("render_shapes: no canvas/context found (variable `c` missing)");
            return;
        }
        c.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Draw grid lines
        this.render_lines();

        // Draw marks
        const cellSize = canvasEl.width / 3;
        const margin = cellSize * 0.18; // spacing inside each cell
        const strokeWidth = Math.max(6, Math.round(cellSize * 0.08));
        c.lineWidth = strokeWidth;
        c.lineCap = "round";
        c.strokeStyle = "#222";

        for (let i = 0; i < 9; i++) {
            const mark = pos[i];
            if (!mark || mark === "#") continue;

            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = col * cellSize;
            const y = row * cellSize;

            if (mark === "X" || mark === "x") {
                c.beginPath();
                c.moveTo(x + margin, y + margin);
                c.lineTo(x + cellSize - margin, y + cellSize - margin);
                c.moveTo(x + cellSize - margin, y + margin);
                c.lineTo(x + margin, y + cellSize - margin);
                c.stroke();
            } else if (mark === "O" || mark === "o") {
                c.beginPath();
                c.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.32, 0, Math.PI * 2);
                c.stroke();
            } else {
                // Unknown mark: skip
            }
        }
    }

    restart() {
        this.start = Math.floor(Math.random() * 2) ? "O" : "X";
        console.log(this.start);
        this.move_cache = [];
        this.current_node = this.root_node;

        if (this.start == "O") {
            console.log("WAAAAAAHHHH");
            this.get_moves(Math.floor(Math.random() * 9));
        }

        this.render_shapes(this.current_node.position);
    }
}