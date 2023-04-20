const canvas = document.getElementById("gameCanvas");
const canvasCtx = canvas.getContext("2d");
const title = document.getElementById("title");
document.addEventListener("keydown", keyDown);

//canvas test
canvas.addEventListener("mousedown", doMouseDown, false);
document.getElementById("restartButton").addEventListener("click", restart);

const boardBackground = "black";
const snakeCol = "green";
const fruitCol = "red";

const gridSize = 40;

let gameStarted = false;
let gameOver = false;
let score = 0;

let fruit = {x: 0, y: 0};
let initialSnake = [
	{x: 19, y: 20},
	{x: 19, y: 20},
	{x: 19, y: 20},
	{x: 19, y: 20},
	{x: 19, y: 20},
	{x: 19, y: 20}
];

//shallow copies initialSnake
let snake = [...initialSnake];

let currDirection = "right";

function start() {
	generateFruit();
	update();
}
function restart() {
	title.textContent = "Snake";
	gameOver = false;
	gameStarted = false;
	score = 0;
	snake = [...initialSnake];
	generateFruit();
}
function endGame() {
	gameOver = true;
	title.textContent = "Game Over!";
}
function update() {
	if (gameStarted && !gameOver)
		moveSnake();

	clearCanvas();
	drawSnake();
	drawFruit();
	drawScore();

	//time between ticks is 100ms
	setTimeout(update, 100);
}
function generateFruit() {
	fruit.x = Math.floor(Math.random() * 40);
	fruit.y = Math.floor(Math.random() * 40);
}
function moveSnake() {
	let pos = {x: snake[snake.length - 1].x, y: snake[snake.length - 1].y};
	switch (currDirection) {
	case "left":
		pos.x--;
		if (pos.x < 0) pos.x = gridSize - 1;
		break;
	case "right":
		pos.x++;
		if (pos.x >= gridSize) pos.x = 0;
		break;
	case "up":
		pos.y--;
		if (pos.y < 0) pos.y = gridSize - 1;
		break;
	case "down":
		pos.y++;
		if (pos.y >= gridSize) pos.y = 0;
		break;
	}

	//found fruit
	if (pos.x == fruit.x && pos.y == fruit.y) {
		generateFruit();
		score++;
	} else {
		snake.shift();
	}

	//check whether snake ate itself
	for (i of snake) {
		if (i.x == pos.x && i.y == pos.y) {
			endGame();
			return;
		}
	}

	snake.push(pos);
}

//inputs
function doMouseDown(event) {
	//note: pageX is absolute position by document, offsetX is relative to canvas
	//https://www.w3schools.com/jsref/obj_mouseevent.asp
	console.log(`${event.offsetX}, ${event.offsetY}`);
}
function keyDown(event) {
	const left = 37;
	const right = 39;
	const up = 38;
	const down = 40;

	if (!event.keyCode) return;

	let started = true;
	switch (event.keyCode) {
	case (left):
		currDirection = "left";
		break;
	case (right):
		currDirection = "right";
		break;
	case (up):
		currDirection = "up";
		break;
	case (down):
		currDirection = "down";
		break;
	default:
		started = false;
		break;
	}
	if (!gameStarted && !gameOver) gameStarted = started;
}

//rendering
function clearCanvas() {
	canvasCtx.fillStyle = boardBackground;
	canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSnake() {
	canvasCtx.fillStyle = snakeCol;
	for (pos of snake) {
		canvasCtx.fillRect(pos.x * 10, pos.y * 10, 10, 10);
	}
}
function drawScore() {
	document.getElementById("score").textContent = `Score: ${score}`;
}
function drawFruit() {
	canvasCtx.fillStyle = fruitCol;
	canvasCtx.fillRect(fruit.x * 10, fruit.y * 10, 10, 10);
}

start();