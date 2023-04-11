function loadBoard() {
	let game = new Game();
	var grid = game.BuildGameBoard();
	var keygrid = game.BuildKeyBoard();
	ReactDOM.render(grid, gameboard);
	ReactDOM.render(keygrid, keyboard);

	let guesses = ["MIGHT", "FLOOD", "STRAY"];

	for (let row=0; row < guesses.length; row++) {
		game.showGuess(guesses[row]);
		game.checkGuess(guesses[row]);
	}
}

function Game() {
	this.numSquares = 30;
	this.qwerty = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
	this.colors = ["#86888a", "#cdb559", "#6aaa64", "#ffffff"]
	this.theWord = "MOODY"; // hardcoded for assignment
	this.start = 0;  // Start of row range
	this.end = 4;    // End of row range

	this.BuildGameBoard = BuildGameBoard;
	this.BuildKeyBoard = BuildKeyBoard;
	this.showGuess = showGuess;
	this.checkGuess = checkGuess;
	this.updateColors = updateColors;
}

function BuildGameBoard() {
	let squares = [];
    for (let index=0; index < this.numSquares; index++) {
        squares.push(index) ;
    }
	return React.createElement("div", {id: "grid"},
        squares.map((sq, ii)=> React.createElement(Square, {numId: sq, key: ii}, null)));
}

function Square(props) {
	return React.createElement("button", {id:"square" + props.numId, className: "square"}, " ");
}

function BuildKeyBoard() {
	var keygrid = [];
	for (let row = 0; row < this.qwerty.length; row++) {
		var letters = this.qwerty[row].split("");

		// on the third row, add ENTER key as the first key and "BACK" as the last key
		if (row === 2) {
			letters.splice(0, 0, "ENTER");
			letters.push("BACK");
		}
		keygrid[row] = React.createElement("div", {id: "keygrid", key: row},
			letters.map((letter, ii) => React.createElement(KeyButton, {letter: letter, key: ii}, null)));
	}

	return keygrid;
}

function KeyButton({letter}) {
	return React.createElement("button",
		{id: letter + "button", className: ((letter === "ENTER") || (letter === "BACK")) ? "funckey" : "key"},
		letter);
}

function showGuess(guess) {
	let letters = guess.split("");

	let ii=0, index;
	for (index = this.start; index <= this.end; index++) {
		document.getElementById("square" + index).innerText = letters[ii];
		ii++;
	}
}

function checkGuess(guess) {
	// assuming input guess is valid

	// if valid, update colors
	this.updateColors(guess);

	// update the row ranges
	this.start += 5;
	this.end += 5;
}
function updateColors(guess) {
	let index = 0;
	let wordArray = this.theWord.split("");
	let guessArray= guess.split("");
	let results = [];

	guessArray.forEach( letter => {
		if (letter === wordArray[index]) {
			// if letter is in the correct place, turn green
			results.push(2);
		} else {
			if (wordArray.includes(letter)) {
				// if letter is in the word but not the correct place, turn yellow
				results.push(1);
			} else {
				// if letter is not in the word at all, turn gray
				results.push(0);
			}
		}
		index++;
	});

	let btn, sq;
	let sqIndex = this.start;
	let rgbGreen = "rgb(106, 170, 100)";  // background color is returned as rgb() instead of hex
	for (index = 0; index < 5; index++) {
		// update keyboard letter color
		btn = document.getElementById(guessArray[index]+"button");
		btn.style.color = this.colors[3];

		// if keyboard letter is green, do not change the color
		if (btn.style.backgroundColor !== rgbGreen) {
			btn.style.backgroundColor = this.colors[results[index]];
		}

		// update wordle square color
		sq = document.getElementById("square"+sqIndex);
		sq.style.color = this.colors[3];
		sq.style.backgroundColor = this.colors[results[index]];
		sqIndex++;
	}

}
