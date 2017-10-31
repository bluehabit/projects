var startPuzzle = document.querySelector('.startPuzzle'),
puzzleSolved = document.querySelector('.puzzleSolved'),
puzzleUnsolved = document.querySelector('.puzzleUnsolved'),
difficultyContainer = document.querySelector('.difficultyContainer'),
heartParent = document.querySelector('.temp'),
nightmareMode;

var puzzlePieces = document.querySelectorAll('.temp > img');
var divContainers = document.querySelectorAll('div.match');
var gameStart;

var pistol = new Audio('sounds/dspistol.wav'),
vault = new Audio('sounds/vault.mp3'),
xcom = new Audio('sounds/xcom.mp3');

var hoof = new Audio('sounds/dshoof.wav');
hoof.volume = .32;
var pickup = new Audio('sounds/dsitemup.wav');

var uv = document.querySelector('.uv'),
nightmare = document.querySelector('.nightmare');

var hintButton = document.querySelector('.hint');
var resetButton = document.querySelector('.reset');

resetButton.addEventListener('click', function(){
	initGame();
})

hintButton.addEventListener('mouseenter', function(){
	puzzleSolved.classList.toggle('hidden');
	puzzleUnsolved.classList.toggle('hidden'); 
});

hintButton.addEventListener('mouseout', function(){
	puzzleSolved.classList.toggle('hidden');
	puzzleUnsolved.classList.toggle('hidden'); 
});

var difficultyButtons = document.querySelectorAll('.difficultyContainer > button')

startPuzzle.addEventListener('click', function(){
	pistol.currentTime = 0;
	pistol.play();
	puzzleSolved.classList.add('hidden');
	puzzleUnsolved.classList.remove('hidden');
	heartParent.classList.remove('hidden');
	generatePieces()
	puzzleSolved.classList.add('fade')
	puzzleUnsolved.classList.add('fadeOut')
	this.classList.add('hidden');
	hintButton.classList.remove('hidden');
	resetButton.classList.remove('hidden');

	// setTimeout(function(){ 
	// 	//remove animation with f(x) call
	// 	animateDriftPuzzle();
	// 	gameStart = true;
	// }, 2000);
});

difficultyButtons.forEach(function(button){
	button.addEventListener('mouseenter', function(){
		vault.currentTime = 0; //rewind audio element to the start
		vault.play();
	});

	button.addEventListener('click', function(){
		pistol.currentTime = 0;
		vault.pause();
		pistol.play();
		startPuzzle.classList.remove('hidden');
		difficultyContainer.classList.add('hidden');
	});
});

nightmare.addEventListener('click', function(){
	nightmareMode = true;
	console.log('nightmare mode:', nightmareMode)
});

//if(!nightmare) 

console.log('hey!')

function initGame(){
	puzzleSolved.classList.add('hidden');
	puzzleUnsolved.classList.remove('hidden');
	startPuzzle.classList.add('hidden');
	difficultyContainer.classList.remove('hidden');
	hintButton.classList.add('hidden');
	resetButton.classList.add('hidden');

	animateDriftPuzzle('animate')

	nightmareMode = false;
	gameStart = false;
	placeBoard();
	console.log('init game')
};


puzzlePieces.forEach(function(piece){
	piece.clicked = false;
	piece.addEventListener('click', selectPiece)
});

function animateDriftPuzzle(status){
	if(status){
		puzzlePieces.forEach(function(piece){
			piece.classList.add('transitionAll');
		})
	} else {
		puzzlePieces.forEach(function(piece){
			piece.classList.remove('transitionAll');
		})
	}	
}

function selectPiece(e){
	if(gameStart){
		var piece = this;
		this.clicked = !this.clicked
		piece.classList.remove('noShadow');

		puzzlePieces.forEach(function(piece){
			piece.classList.remove('appearOnTop');	
		})

		piece.classList.add('appearOnTop');

		if(this.clicked){
			pickup.play();	
			this.classList.toggle('highZindexValue');
		} else {
			this.classList.toggle('highZindexValue');
		}

		divContainers.forEach(function(container){
			if(checkBoundary(piece, container)){
				lockPiece(piece, container);
				checkWin();
			} 
		});

		resetDivContainers()
		boardState()
	}
}

window.addEventListener('mousemove', function(evt){
	puzzlePieces.forEach(function(piece){
		if(piece.clicked){
			var pieceParent = piece.offsetParent.getBoundingClientRect();
			piece.style.left = evt.clientX - pieceParent.x - 55 + 'px';
			piece.style.top = evt.clientY - pieceParent.y - 55 + 'px';
		} else {
			return;
		}
	})
})


function boardState(){
	divContainers.forEach(function(divContainer){
		puzzlePieces.forEach(function(puzzlePiece){
			if (checkBoundary(puzzlePiece, divContainer)) {
        	divContainer.dataset.occupied = "true";
      		}
		})
	})
}

function resetDivContainers(){
	divContainers.forEach(function(divContainer){
		divContainer.dataset.occupied = "false";
	})
}

function placeBoard(){
	var divBoundary;
	var divParent;

	animateDriftPuzzle('animate');

	divContainers.forEach(function(container){
		puzzlePieces.forEach(function(puzzlePiece){
			if(puzzlePiece.dataset.match === container.dataset.match){
				divBoundary = container.getBoundingClientRect();
				divParent = container.offsetParent.getBoundingClientRect(); 

				puzzlePiece.classList.add('noShadow');
				puzzlePiece.style.top = divBoundary.top - divParent.y + 'px';
				puzzlePiece.style.left = divBoundary.left - divParent.x + 'px';
			}
		})
	})
}

function checkBoundary(puzzlePiece, currentDiv){
	var currentDiv = currentDiv;
	var divBoundary = currentDiv.getBoundingClientRect();

	if(between(puzzlePiece.getBoundingClientRect().x, divBoundary.left - 15, divBoundary.right - 55) 
		&& between(puzzlePiece.getBoundingClientRect().y, divBoundary.top - 15, divBoundary.bottom - 85) 
		&& !puzzlePiece.clicked) {	
				return true;
	} else {
		return false;
	}
}

function lockPiece(puzzlePiece, divContainer){
	if(divContainer.dataset.occupied === 'false'){
		var divBoundary = divContainer.getBoundingClientRect();
		var divParent = divContainer.offsetParent.getBoundingClientRect();
		
		puzzlePiece.classList.add('noShadow');
		puzzlePiece.style.top = divBoundary.top - divParent.y + 'px';
		puzzlePiece.style.left = divBoundary.left - divParent.x + 'px';

		hoof.play();
	} else {
		return
	}
}

function between(input, min, max) {
  return input >= min && input <= max;
}

function checkWin(){
	var total = 0;
	divContainers.forEach(function(container){
		puzzlePieces.forEach(function(puzzlePiece){
			if(checkBoundary(puzzlePiece, container) && puzzlePiece.dataset.match === container.dataset.match){
				total++;
			}
		})
	})
	
	if(total === divContainers.length){
		console.log('you win')
	}
}

/*existing code*/

initGame();


/****Generate Pieces****/

var babyContainer = document.querySelector('.babyContainer')
var babyCoordinates = babyContainer.getBoundingClientRect();

function generatePieces(){
	var divParent = babyContainer.offsetParent.getBoundingClientRect();

	puzzlePieces.forEach(function(piece){
		piece.coordinates = makeRandomCoords(babyCoordinates.left - 25, babyCoordinates.right - 105, babyCoordinates.bottom, babyCoordinates.top - 23)

		piece.style.left = piece.coordinates.x - divParent.x + 15 + 'px';
		piece.style.top = piece.coordinates.y - divParent.y + 15 + 'px';
	})
}

function makeRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function makeRandomCoords(xMin, xMax, yMin, yMax) {
  var coordinates = {}
  coordinates.x = Math.floor(Math.random() * (xMax - xMin) + xMin);
  coordinates.y = Math.floor(Math.random() * (yMax - yMin) + yMin);
  return coordinates; 
}

// makeRandom(babyCoordinates.left, babyCoordinates.right, babyCoordinates.bottom, babyCoordinates.top)


