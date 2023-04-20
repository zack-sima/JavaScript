const canvas = document.getElementById("gameCanvas");
const canvasCtx = canvas.getContext("2d");

canvas.addEventListener("mousedown", mouseDown, false);

//from https://stackoverflow.com/questions/3684285/how-to-prevent-text-select-outside-html5-canvas-on-double-click
canvas.onselectstart = function () { return false; }

const lightTile = "#EDE7DD";
const darkTile = "#70AF73";
const highlightedTile = "#F2B64E";

class Piece {
	constructor(position, name, image) {
		this.position = position;
		this.name = name;
		this.image = image;
	}
}
class Tile {
	constructor(position, piece) {
		this.position = position;
		this.piece = piece;
	}
}
class Board {
	constructor() {
		this.positions = [];
		for (let i = 0; i < 8; i++) {
			this.positions.push([]);
			for (let j = 0; j < 8; j++) {
				this.positions[i].push(new Tile([i, j], null));
			}
		}
	}
}

const initialPieces = [
	//row is 0=a, etc
	[0, 0, "wrook"], [1, 0, "wknight"], [2, 0, "wbishop"], [3, 0, "wqueen"], [4, 0, "wking"], [5, 0, "wbishop"], [6, 0, "wknight"], [7, 0, "wrook"],
	[0, 1, "wpawn"], [1, 1, "wpawn"], [2, 1, "wpawn"], [3, 1, "wpawn"], [4, 1, "wpawn"], [5, 1, "wpawn"], [6, 1, "wpawn"], [7, 1, "wpawn"],
	[0, 7, "brook"], [1, 7, "bknight"], [2, 7, "bbishop"], [3, 7, "bqueen"], [4, 7, "bking"], [5, 7, "bbishop"], [6, 7, "bknight"], [7, 7, "brook"],
	[0, 6, "bpawn"], [1, 6, "bpawn"], [2, 6, "bpawn"], [3, 6, "bpawn"], [4, 6, "bpawn"], [5, 6, "bpawn"], [6, 6, "bpawn"], [7, 6, "bpawn"],
];

//boolean value for loaded or not
const piecesSrc = [
	"wking", "wqueen", "wknight", "wbishop", "wrook", "wpawn",
	"bking", "bqueen", "bknight", "bbishop", "brook", "bpawn"
];

const piecesLoaded = {};

var board = new Board();
var selectedTile = [-1, -1];

start();

function start() {
	for (i of piecesSrc) {
		let piece = new Image();
		piece.src = `res/${i}.png`;
		piece.name = i;
		piece.onload = function() {
			piecesLoaded[this.name] = this;
		};
	}

	for (i of initialPieces) {
		board.positions[i[0]][i[1]].piece = i[2];
	}

	update();
}
function update() {
	drawBoard();

	//30fps target
	setTimeout(update, 30);
}
function drawBoard() {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			//NOTE: from white's perspective
			if ((i + j) % 2 == 0) {
				canvasCtx.fillStyle = lightTile;
			} else {
				canvasCtx.fillStyle = darkTile;
			}
			if (selectedTile[0] == i && selectedTile[1] == 7 - j) {
				canvasCtx.fillStyle = highlightedTile;
			}
			canvasCtx.fillRect(i * 50, 350 - j * 50, 50, 50);

			//add pieces (temporary king)
			if (board.positions[i][j].piece != null && board.positions[i][j].piece in piecesLoaded) {
				canvasCtx.drawImage(piecesLoaded[board.positions[i][j].piece], i * 50, 350 - j * 50, 50, 50);
			}
		}
	}
}

//controls
function mouseDown(event) {
	let x = Math.floor(event.offsetX / 50);
	let y = Math.floor(event.offsetY / 50);

	if (selectedTile[0] != x || selectedTile[1] != y) {
		//select tile=
		if (selectedTile[0] != -1 && selectedTile[1] != -1 && board.positions[selectedTile[0]][7 - selectedTile[1]].piece != null) {
			board.positions[x][7 - y].piece = board.positions[selectedTile[0]][7 - selectedTile[1]].piece
			board.positions[selectedTile[0]][7 - selectedTile[1]].piece = null;
			console.log("movepiece");

			selectedTile = [-1, -1];
		} else {
			selectedTile = [x, y];
		}
	} else {
		//deselect
		selectedTile = [-1, -1];
	}
}