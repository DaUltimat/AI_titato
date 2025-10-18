const canvas = document.querySelector("#playing_board");
const c = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 360;

let game = new Game();

canvas.addEventListener("click", (e) => {
    let position = { x: e.offsetX, y: e.offsetY };
    let converted = { x: Math.floor(position.x / 120), y: Math.floor(position.y / 120)};
    let tile = converted.x + converted.y * 3;

    game.play_move(tile);
});