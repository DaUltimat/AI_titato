const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const main_tree = new Node(0);
const SPHERE_SIZE = 100;
const ZOOM = 1;

main_tree.add(2);
main_tree.add(4);
main_tree.nodes[0].add(5);
main_tree.nodes[0].add(7);
main_tree.nodes[0].nodes[1].add(6);

function visualizeTree(node, prefix = "", isLast = true) {
    const connector = node.parent ? (isLast ? "└── " : "├── ") : "";
    const moveType = node.move ? "MAX" : "MIN";
    const valueStr = node.value !== null ? node.value : "·";

    console.log(prefix + connector + `[${moveType}] value: ${valueStr}`);

    const newPrefix = prefix + (node.parent ? (isLast ? "    " : "│   ") : "");

    node.nodes.forEach((child, i) => {
        const last = i === node.nodes.length - 1;
        visualizeTree(child, newPrefix, last);
    });
}

visualizeTree(main_tree);