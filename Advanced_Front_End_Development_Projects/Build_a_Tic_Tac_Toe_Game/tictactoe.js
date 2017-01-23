function game() {
  this.player1 = '';
  this.player2 = '';
  this.players = '';
	this.currPlayer = '';
  this.board = {'00':'',
                '01':'',
                '02':'',
                '10':'',
                '11':'',
                '12':'',
                '20':'',
                '21':'',
                '22':''};
  this.turns = 0;
  this.winningCombos = [
    ['00', '01', '02'],
    ['10', '11', '12'],
    ['20', '21', '22'],
    ['00', '10', '20'],
    ['01', '11', '21'],
    ['02', '12', '22'],
    ['00', '11', '22'],
    ['02', '11', '20']
  ];
}

/*------GAME LOGIC--------*/
//draw X or O on game board
game.prototype.drawXorO = function(value) {
  if(document.getElementById(value).innerHTML) {
    document.getElementById(value).innerHTML = this.currPlayer;
  } else {
    this.updateBoard(value);
    document.getElementById(value).innerHTML = this.currPlayer;
  }
  this.setColor(value);
}

//Change player
game.prototype.updatePlayer = function() {
  this.turns++;
  if(this.currPlayer === this.player1) {
    this.currPlayer = this.player2;
  } else {
    this.currPlayer = this.player1;
  }
}

//Update board object after each turn
game.prototype.updateBoard = function(value) {
  this.updatePlayer();
  if(!this.board[value]) {
    //fill space with X or O
    this.board[value] = this.currPlayer;
  }
}

//Check to see if there is a winner
game.prototype.checkWinner = function() {
  var combinations = this.winningCombos;
  var board = this.board;
  var player = this.currPlayer;
  return combinations.some(function(arr){
    return arr.every(function(el){
      return board[el] === player;
    });
  });
}

//Create new elements to display the winner and button to reset the game
game.prototype.getResultElements = function(text) {
  var message = document.getElementById("message");
  message.style.visibility = "visible";
  var result = document.getElementById("result");
  result.style.visibility = "visible";
  result.innerHTML = text;
  var reset = document.getElementById("reset");
  reset.style.visibility = "visible";
}

//Winner message
game.prototype.displayWinner = function() {
  return this.currPlayer + " wins!";
}

//Draw message
game.prototype.displayDraw = function() {
  return "Draw!";
}

//Methods called when a space is clicked
game.prototype.getTurn = function(value) {
  this.drawXorO(value);
  if(this.players === 'one' && this.turns < 9) {
    this.computerTurn();
  }

  if(this.checkWinner() === true) {
    this.getResultElements(this.displayWinner());
  }
  if(this.checkDraw() === true) {
    this.getResultElements(this.displayDraw());
  }
}

//Set symbol color
game.prototype.setColor = function(value) {
  if(document.getElementById(value).innerHTML === 'X') {
    document.getElementById(value).style.color = "#B10DC9";
  } else {
    document.getElementById(value).style.color = "#39CCCC";
  }
}

//Checks for a possible draw if there is no winner
game.prototype.checkDraw = function() {
  if(this.turns > 8 && this.checkWinner() === false) {
    return true;
  }
}

//Choose number of players for game
game.prototype.chooseGame = function(id) {
  this.players = id;
  document.getElementById("chooseGame").style.visibility = "hidden";
  document.getElementById("choosePlayer").style.visibility = "visible";
}

//Choose X or O
game.prototype.playerChoice = function(text) {
  this.player1 = text;
  if(this.player1 === 'X') {
    this.player2 = 'O';
  } else {
    this.player1 = 'O';
    this.player2 = 'X';
  }
  document.getElementById("choosePlayer").style.visibility = "hidden";
  document.getElementById("displayGame").style.visibility = "visible";
}

/*------COMPUTER MOVES--------*/
//Computer move
game.prototype.computerTurn = function() {
  if(this.checkBlockOrWin()[0]) {
    this.setBlock();
  } else {
    this.computerMove();
  }
}
//Filter out filled in rows
game.prototype.getOpenMoves = function() {
  var combinations = this.winningCombos;
  var board = this.board;
  return combinations.filter(function(arr){
    var fill = arr.every(function(el){
      return board[el];
    });
    if(fill === true) {
      return false;
    }
    return true;
  });
}
//Get opponent symbol
game.prototype.getLastPlayer = function() {
  if(this.currPlayer === this.player1) {
    return this.player2;
  } else {
    return this.player1;
  }
}
//check if other player is about to score
//if true, block player
game.prototype.checkBlockOrWin = function() {
  var open = this.getOpenMoves();
  var board = this.board;
  var opponent = this.currPlayer;
  var player = this.getLastPlayer();
  var empty;
  //Find spot needed for block or win
  return open.filter(function(combo) {
    var opp = combo.filter(function(el){
      if(board[el] === opponent && board[el] !== player) {
        return el
      } else if(!board[el]){
        empty = el;
      }
    });
    var play = combo.filter(function(el){
      if(board[el] === player && board[el] !== opponent) {
        return el;
      } else if(!board[el]) {
        empty = el;
      }
    });
    if(opp.length === 2 || play.length === 2) {
      return empty;
    }
  });

}

//check if opponent could win. If true, set block;
game.prototype.setBlock = function() {
  var blockArray = this.checkBlockOrWin()[0];
  var space;
  this.updatePlayer();
  var board = this.board;
  var player = this.currPlayer;
  for(var i = 0; i < blockArray.length; i++) {
    if(!board[blockArray[i]]) {
      space = blockArray[i];
    }
  }
  document.getElementById(space).innerHTML = player;
  board[space] = player;
  this.setColor(space);
}
//Return all unoccupied spaces on the board
game.prototype.getEmptySpots = function() {
  var board = this.board;
  var empty = [];
  for(var i in board) {
    if(!board[i]) {
      empty.push[i];
    }
  }
  return empty;
}
//set move if not blocking
game.prototype.computerMove = function() {
  this.updatePlayer();
  var center = '11';
  var board = this.board;
  var openSpots = this.getEmptySpots();
  var cornerMoves = this.checkCorner();
  if(!board[center]) {
    board[center] = this.currPlayer;
    document.getElementById(center).innerHTML = this.currPlayer;
    this.setColor(center);
  } else if(cornerMoves[0]) {
    board[cornerMoves[0]] = this.currPlayer;
    document.getElementById(cornerMoves[0]).innerHTML = this.currPlayer;
    this.setColor(cornerMoves[0]);
  } else if(openSpots[0]){
    board[openSpots[0]] = this.currPlayer;
    document.getElementById(openSpots[0]).innerHTML = this.currPlayer;
    this.setColor(openSpots[0]);
  }
}

//Return open corner spaces
game.prototype.checkCorner = function() {
  var corners = ["00","02","20","22"];
  var board = this.board;
  return corners.filter(function(corner){
    if(!board[corner]) {
      return corner;
    }
  });
}

/*------RESET GAME PROPERTIES--------*/
//Reset board object
game.prototype.resetBoard = function() {
  return this.board = {'00':'',
                '01':'',
                '02':'',
                '10':'',
                '11':'',
                '12':'',
                '20':'',
                '21':'',
                '22':''};
}

//Reset turns for the game
game.prototype.resetGame = function() {
  this.turns = 0;
  this.player1 = '';
  this.player2 = '';
  this.players = '';
  this.currPlayer = '';
}

//Reset visible game board
game.prototype.clearBoard = function() {
  var cells = document.getElementsByTagName("td");
  for(var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = '';
  }
}

//Compiles reset functions
game.prototype.getReset = function() {
  this.resetBoard();
  this.resetGame();
  this.clearBoard();
  document.getElementById("chooseGame").style.visibility = "visible";
  document.getElementById("displayGame").style.visibility = "hidden";
  document.getElementById("reset").style.visibility = "hidden";
  document.getElementById("result").style.visibility = "hidden";
  document.getElementById("message").style.visibility = "hidden";
}



var myGame = new game();
var players = document.getElementsByClassName('game');
for(var i = 0; i < players.length; i++) {
  players[i].addEventListener("click", function(){
    myGame.chooseGame(this.id);
  });
}

var choices = document.getElementsByClassName('choice');
for(var k = 0; k < players.length; k++) {
  choices[k].addEventListener("click", function() {
    myGame.playerChoice(this.innerHTML);
  });
}

var cells = document.getElementsByTagName('td');
for(var t = 0; t < cells.length; t++) {
  cells[t].addEventListener("click", function() {
    myGame.getTurn(this.id);
  });
}

document.querySelector("body").addEventListener("click", function() {
  if(event.target.id === "reset") {
    myGame.getReset();
  }
});
