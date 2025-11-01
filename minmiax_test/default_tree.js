let variants = 0;
let depth = 0;

class Node {
    constructor(value, parent, depth = 0) {
        this.value = value;
        this.nodes = [];
        this.depth = depth;
        this.parent = parent ? parent : 0;
    }

    add(value = 0, depth = 0) {
        const childDepth = depth ? depth : this.depth + 1;
        const child = new Node(value, this, childDepth);
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
        const cloned = new Node(this.value, clonedParent, this.depth);

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
}