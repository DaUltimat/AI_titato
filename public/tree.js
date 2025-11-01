let variants = 0;

class Node {
    constructor(value, parent, depth = 0, move = false, position = "#########") {
        this.value = value;
        this.nodes = [];
        this.depth = depth;
        this.parent = parent ? parent : 0;
        this.move = move; // 1: Amax, 0: Bmin
        this.position = position;
        if (value == null) { this.value = this.check_win(); }
        variants += 1;
        if (variants % 1000 === 0)
            document.querySelector("#variant_count").innerHTML = variants;
        this.square = null;


        this.possible_moves_till_now = 0;
        this.possible_wins_till_now = { min: 0, max: 0 };
    }

    add(value = 0, position = "#########", square = null, depth = 0) {
        const childDepth = depth ? depth : this.depth + 1;
        const child = new Node(value, this, childDepth, !this.move, position);
        child.square = square;
        this.nodes.push(child);
        return child;
    }

    set(value) {
        this.value = value;
    }

    delete() {
        const i = this.parent.nodes.indexOf(this);
        if (i !== -1) {
            this.parent.nodes.splice(i, 1);
        }

        this.parent = null;
    }

    clone(preserveParent = true) {
        const clonedParent = preserveParent ? this.parent : null;
        const cloned = new Node(this.value, clonedParent, this.depth, this.move, this.position);

        this.nodes.forEach(child => {
            const childClone = child.clone(false);
            childClone.parent = cloned;
            cloned.nodes.push(childClone);
        });

        return cloned;
    }

    collapse() {
        this.parent.parent.add(this.value);
        this.delete();
    }

    collapse_nodes() {
        const clone = this.clone(false);

        clone.nodes.forEach(node => {
            node._collapse_nodes_inplace();
        });

        return clone;
    }

    _collapse_nodes_inplace() {
        this.nodes.forEach(child => child._collapse_nodes_inplace());
        this.nodes.forEach(child => {
            if (this.parent) {
                this.parent.nodes.push(new Node(child.value, this.parent, child.depth, child.move, child.position));
            }
        });

        this.nodes.length = 0;
    }

    clean_up() {
        this.nodes.forEach((node) => {
            node.clean_up();
        });

        if (this.nodes.length !== 0) {
            this.value = null;
        }
    }

    mini_max() {
        this.clean_up();
        this.calc_outcome();
    }

    calc_outcome() {
        if (this.value == null) {
            this.nodes.forEach((node, i) => {
                node.calc_outcome();
            })
        } else {
            if (this.parent) {
                const child_vals = this.parent.nodes.map(child => child.value).filter((val) => val != null);
                if (child_vals.length === this.parent.nodes.length) {
                    if (this.parent.move === false) {
                        let val = Math.min(...child_vals);
                        this.parent.value = val;
                        this.parent.calc_outcome();
                    } else {
                        let val = Math.max(...child_vals);
                        this.parent.value = val;
                        this.parent.calc_outcome();
                    }
                }
            }
        }
    }

    check_win() {
        const p = this.position;
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Check all winning combinations
        for (let [a, b, c] of wins) {
            if (p[a] !== "#" && p[a] === p[b] && p[a] === p[c]) {
                return p[a] === "X" ? 1 : -1;
            }
        }

        if (!p.includes("#")) return 0;

        return null;
    }

    calculate_all_nodes(move) {
        this._calculate_move_variants(move);
        this.update_subtree_stats();
        this.mini_max();
    }

    update_subtree_stats() {
        let totalMoves = 0;
        let minWins = 0;
        let maxWins = 0;

        for (const child of this.nodes) {
            child.update_subtree_stats();

            totalMoves += 1 + child.possible_moves_till_now;

            minWins += child.possible_wins_till_now.min;
            maxWins += child.possible_wins_till_now.max;

            if (child.value === -1) {
                minWins += 1;
            } else if (child.value === 1) {
                maxWins += 1;
            }
        }

        this.possible_moves_till_now = totalMoves;
        this.possible_wins_till_now = { min: minWins, max: maxWins };
    }

    _calculate_move_variants(move) { // X or O
        let split = this.position.split("");

        if (this.value == null) {
            split.forEach((square, i) => {
                if (square === "#") {
                    let newPosition = [...split];
                    newPosition[i] = move;
                    newPosition = newPosition.join("");

                    this.add(null, newPosition, i);
                }
            });

            if (this.depth < 9 && variants < 10000000) {
                this.nodes.forEach((node) => {
                    node._calculate_move_variants(move === "X" ? "O" : "X");
                });
            }
        }
    }
}