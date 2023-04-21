const canvas = document.getElementById("gameCanvas");
const canvasCtx = canvas.getContext("2d");

canvas.addEventListener("mousedown", mouseDown, false);

//from https://stackoverflow.com/questions/3684285/how-to-prevent-text-select-outside-html5-canvas-on-double-click
canvas.onselectstart = function () { return false; }

const lightTile = "#EDE7DD";
const darkTile = "#70AF73";
const highlightedTile = "#F2B64E";

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

//store the king positions for quick access
const wKing = [-1, -1];
const bKing = [-1, -1];
let lastEnPassant = -1; //if the previous move can be en passant, set this to the rank

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

		//king position
		if (i[2] == "wking") {
			wKing[0] = i[0];
			wKing[1] = i[1];
		} else if (i[2] == "bking") {
			bKing[0] = i[0];
			bKing[1] = i[1];
		}
	}

	update();
}
function update() {
	drawBoard();

	//30fps target
	setTimeout(update, 30);
}
function moveIsLegal(piece, oldPos, newPos) {
	console.log(`${JSON.stringify(piece)}, ${JSON.stringify(oldPos)}, ${JSON.stringify(newPos)}`);

	//check for checks (no pun intended)
	//if ()

	//can't have a friendly piece on new square
	if (board.positions[newPos[0]][newPos[1]].piece != null && board.positions[newPos[0]][newPos[1]].piece.slice(0, 1) == piece.slice(0, 1)) {
		console.log("obstructed");
		return false;
	}

	let pieceName = piece.slice(1);

	switch (pieceName) {
	case "knight":
		//move two and one
		if (Math.abs(newPos[0] - oldPos[0]) == 2 && Math.abs(newPos[1] - oldPos[1]) == 1 || Math.abs(newPos[0] - oldPos[0]) == 1 && Math.abs(newPos[1] - oldPos[1]) == 2) {
			return true;
		} else {
			return false;
		}
		break;
	case "rook":
		//straight lines
		return newPos[0] - oldPos[0] == 0 || newPos[1] - oldPos[1] == 0;
	case "queen":
		//straight lines or diagonals
		return (newPos[0] - oldPos[0] == 0 || newPos[1] - oldPos[1] == 0) || (Math.abs(newPos[0] - oldPos[0]) == Math.abs(newPos[1] - oldPos[1]));
	case "bishop":
		return Math.abs(newPos[0] - oldPos[0]) == Math.abs(newPos[1] - oldPos[1]);
	case "pawn":
		//has enemy piece
		if (board.positions[newPos[0]][newPos[1]].piece != null) {
			//diagonal by one
			if (piece.slice(0, 1) == "w") {
				return newPos[1] - oldPos[1] == 1 && Math.abs(newPos[0] - oldPos[0]) == 1;
			} else {
				return newPos[1] - oldPos[1] == -1 && Math.abs(newPos[0] - oldPos[0]) == 1;
			}
		} else {
			//en passant
			if (lastEnPassant != -1) {
				if (piece.slice(0, 1) == "w") {
					if (Math.abs(newPos[0] - oldPos[0]) == 1 && oldPos[1] == 4) return true;
				} else {
					if (Math.abs(newPos[0] - oldPos[0]) == 1 && oldPos[1] == 3) return true;
				}
			}
			//straight by one (or two if on rank 2/7)
			if (piece.slice(0, 1) == "w") {
				console.log(newPos[1] - oldPos[1]);
				return newPos[0] == oldPos[0] && (newPos[1] - oldPos[1] == 1 || newPos[1] - oldPos[1] == 2 && oldPos[1] == 1);
			} else {
				return newPos[0] == oldPos[0] && (newPos[1] - oldPos[1] == -1 || newPos[1] - oldPos[1] == -2 && oldPos[1] == 6);
			}
		}
	}


	return true;
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

			//draw pieces
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
		let newTile = board.positions[x][7 - y];

		let oldTile = null;
		if (selectedTile[0] != -1 && selectedTile[1] != -1) {
			oldTile = board.positions[selectedTile[0]][7 - selectedTile[1]];
		}

		//if selectedTile is not null and piece has been clicked
		if (selectedTile[0] != -1 && selectedTile[1] != -1 && oldTile.piece != null && moveIsLegal(oldTile.piece, [selectedTile[0], 7 - selectedTile[1]], [x, 7 - y])) {

			//remove en passanted pawn if pawn made capture move on empty square
			if (newTile.piece == null && selectedTile[0] != x) {
				if (oldTile.piece == "wpawn") {
					//removes black pawn
					board.positions[x][4].piece = null;
				} else if (oldTile.piece == "bpawn") {
					//removes white pawn
					board.positions[x][3].piece = null;
				}
			}

			newTile.piece = board.positions[selectedTile[0]][7 - selectedTile[1]].piece;

			//update king position if king
			if (newTile.piece == "wking") {
				wKing[0] = x;
				wKing[1] = y;
			} else if (newTile.piece == "bking") {
				bKing[0] = x;
				bKing[1] = y;
			}

			//update en passant if applicable otherwise set to false
			if (newTile.piece.slice(1) == "pawn" && Math.abs(selectedTile[1] - y) == 2) {
				lastEnPassant = x;
			} else {
				lastEnPassant = -1;
			}

			oldTile.piece = null;

			selectedTile = [-1, -1];
		} else {
			selectedTile = [x, y];
		}
	} else {
		//deselect
		selectedTile = [-1, -1];
	}
}