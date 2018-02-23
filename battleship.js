var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]}],
	
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				alert("Ups, już wcześniej trafiłeś to pole.");
				return true;
			}else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("TRAFIONY!");
				
				if(this.isSunk(ship)) {
					view.displayMessage("Zatopiłeś mój okręt!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Spudłowałeś.")
		return false;
	},
	
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== "hit") {
				return false;
			}
			
		}
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations)); 
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if(direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i< this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};

var controller = {
 	guesses: 0,
 	processGuess: function(guess) {
 		var location = parseGuess(guess);
 		if (location) {
 			this.guesses++;
 			var hit = model.fire(location);
 			if (hit && model.shipsSunk === model.numShips) {
 				view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + this.guesses + " próbach.");

 			}
 		}
 	}
 };

 function parseGuess(guess) {
 	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
 	if (guess === null || guess.length !== 2) {
 		alert("Ups, proszę wpisać literę i cyfrę.");
 	}else {
 		firstChar = guess.charAt(0).toUpperCase();
 		var row = alphabet.indexOf(firstChar);
 		var column = guess.charAt(1);

 		if (isNaN(row) || isNaN(column)) {
 			alert("Ups, to nie są współrzędne!");
 		}else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
 			alert("Ups, pole poza planszą!");
 		}else {
 			return row + column;
 		}
 	}
 	return null;
 }
 

var view = {

	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};



function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	var newGameBtn = document.getElementById("newGame");
	newGameBtn.onclick = newGame;

	model.generateShipLocations();
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}
function newGame() {
	view.displayMessage("");
	model.shipsSunk = 0;
	controller.guesses = 0;
	for (var i = 0; i < model.numShips; i++) {
		var ship = model.ships[i];
		for(var j = 0; j < model.shipLength; j++) {
			ship.hits[j] = "";
		}
	}
	var cellHit = document.getElementsByClassName("hit");
	var cellMiss = document.getElementsByClassName("miss");
	for(i=0; i < cellHit.length; i++) {
		cellHit[i].removeAttribute("class");
	}
	for(i=0; i < cellMiss.length; i++) {
		cellMiss[i].removeAttribute("class");
	}
	model.generateShipLocations();
	console.log("nowa gra");
}

window.onload = init;
