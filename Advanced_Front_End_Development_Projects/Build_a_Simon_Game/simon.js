/*-------------------------------
------------Game object--------
---------------------------------*/
function Game (btnClass,countId,strictId) {
  this.gameSeries = [];
  this.buttons = {0: "topLeft",
                 1: "topRight",
                 2: "bottomLeft",
                 3: "bottomRight"
                 };
  this.isOn = false;
  this.isStarted = false;
  this.isStrict = false;
  this.delay = '';
  this.btnClass = btnClass;
  this.countId = countId;
  this.strictId = strictId;
  this.gameCount = 0;
  this.active = 'active';
  this.gameClass = 'game-on';
  this.smallBtn = 'small';
  this.strictClass = 'strict-on';
}

Game.prototype = {
  constructor: Game,
  //-----On/Off/Start Functions------//
  //Returns boolean value for 'on' state of game
  gameOn:function() {
    return this.isOn;
  },
  //Toggles 'on/off' button and changes 'isOn' property of game object
  //Calls 'onOff' function
  onOffToggle:function(id) {
    document.getElementById(id).classList.toggle(this.gameClass);
    !this.gameOn() ? this.isOn = true : this.isOn = false;
    this.onOff();
  },
  //Changes state of game from on to off
  onOff:function() {
    !this.gameOn() ? this.stopGame() : (this.showCount(), this.enableSmBtn());
  },
  //Starts game sequence. If already started, restarts game.
  startGame:function(el) {
    if(this.gameOn()) {
      if(this.isStarted) {
        newPlayer.switchPlayer();
        this.clearGame();
      } else {
        this.isStarted = true;
        this.enableLgBtn();
      }
      this.newMove();
      this.getGameSeries();
      this.incCount();
    }
  },
  //Turns off game when on/off button toggled
  stopGame:function() {
    this.isStarted = false;
    this.clearGame();
    this.disableAllButtons();
    this.isStrict ? this.changeStrictMode(this.strictId) : false;
  },
  //Sets game and player properties to original values
  clearGame:function() {
    this.gameCount = 0;
    this.showCount();
    this.gameSeries = [];
    newPlayer.clearPlayerSeries();
    clearTimeout(this.delay);
  },
  //--------Disable and enable buttons------------//
  //Toggles disabled value of large game buttons between true and false
  enableLgBtn:function() {
    var buttons = document.getElementsByClassName(this.btnClass);
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].disabled ? buttons[i].disabled = false : buttons[i].disabled = true;
    }
  },
  //Sets disabled to false for start and strict buttons
  enableSmBtn:function() {
    var smallBtn = document.getElementsByClassName(this.smallBtn);
    for(var i = 0; i < smallBtn.length; i++) {
      smallBtn[i].disabled = false;
    }
  },
  //disables all buttons including 'start' and 'strict'
  disableAllButtons:function() {
    var buttons = document.getElementsByTagName("button");
    for(var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      buttons[i].classList.remove(this.active);
    }
  },
  //Randomly selects game button and adds to gameSeries array
  newMove:function() {
    var newNum = Math.round(Math.random()*3);
    this.gameSeries.push(this.buttons[newNum]);
  },
  //--------Color change and play sound for buttons--------//
  //Toggles "active" class for each button to change color
  actButton:function(i) {
    document.getElementById(this.gameSeries[i]).classList.toggle(this.active);
  },
  //Plays and assigns unique sound to each button
  playSound:function(i) {
    var audio = this.gameSeries[i] + "Audio";
    document.getElementById(audio).play();
  },
  //Loops through gameSeries array and changes color while playing a sound for each
  //Timer set between activation of each game button
  getGameSeries:function() {
    clearTimeout(this.delay);
    for(var i = 0; i < this.gameSeries.length; i++) {
      this.setDelay(i);
    }
    newPlayer.switchPlayer();
  },
  //Timer function to change color and play sound after 1.5 second delay
  setDelay:function(i) {
    this.delay = setTimeout(function(){
      myGame.actButton(i);
      myGame.playSound(i);
      myGame.delay = setTimeout(function(){myGame.actButton(i)}, 1000);
    }, 1500*i);
  },
  //Checks if player's button sequence is correct compared to the game
  //After each button is clicked, checks for a match. If playerSeries matches gameSeries,
  //the game either continues or checks to see if the player won
  compareGamePlayer:function() {
    if(newPlayer.isPlayer === true) {
      var series = newPlayer.playerSeries;
      for(var s = 0; s < series.length; s++) {
        if(series[s] !== this.gameSeries[s]) {
          this.checkStrictMode();
        } else if(series.length === this.gameSeries.length){
          this.checkWinner();
        }
      }
    }
  },
  //Selects new random button to establish a longer sequence to continue the game
  continueGame:function() {
    clearTimeout(this.delay);
    this.delay = setTimeout(function() {
      newPlayer.switchPlayer();
      myGame.newMove();
      myGame.getGameSeries();
      myGame.incCount();
    }, 1500);

  },
  //------------Logic for Strict Mode------------//
  //changes color of 'light' above strict button and changes value of 'isStrict' property
  changeStrictMode:function(id) {
    var strictId = id + "Light";
    !this.isStrict ? this.isStrict = true : this.isStrict = false;
    document.getElementById(strictId).classList.toggle(this.strictClass);
  },
  //Checks isStrict value. If true, game is ended if player enters incorrect data one time
  checkStrictMode:function() {
    if(!this.isStrict) {
      this.restart();
    } else {
      this.wrongChoice();
      clearTimeout(this.delay);
      this.delay = setTimeout(function(){
        myGame.strictRestart();
      }, 1000);
    }
  },
    //Restarts game from beginning
  strictRestart:function() {
    this.clearGame();
    this.delay = setTimeout(function() {
      newPlayer.switchPlayer();
      myGame.newMove();
      myGame.getGameSeries();
      myGame.incCount();
    }, 1000);
  },
  //Continues game after an incorrect button is selected. Game is not cleared, sequence is repeated
  restart:function() {
    this.wrongChoice();
    clearTimeout(this.delay);
    this.delay = setTimeout(function() {
      newPlayer.switchPlayer();
      myGame.getGameSeries();
      myGame.showCount();
    }, 1000);
  },
  //-------------Logic to determine winner------------//
  //Checks if player has entered a sequence of 20 buttons in a row. If true,
  //winner is notified that they have won, else, game continues
  checkWinner:function() {
    if(newPlayer.playerSeries.length > 19) {
      clearTimeout(this.delay);
      this.delay = setTimeout(function(){
        myGame.setWin();
        setTimeout(function() {
          myGame.strictRestart();
        }, 5000);
      }, 500);
    } else {
      this.continueGame();
    }
  },
  //Notification of win
  setWin:function() {
    var win = this.gameSeries.pop();
    var winAudio = win + "Audio";
    var i = 0;
    var int = setInterval(function(){
      i++;
      if(i > 6) {
        clearInterval(int);
      } else {
        console.log(win);
        document.getElementById(win).classList.toggle(myGame.active);
        document.getElementById(winAudio).play();
        document.getElementById(myGame.countId).innerHTML = "WIN";
        setTimeout(function(){
          document.getElementById(win).classList.toggle(myGame.active);
        }, 350);
      }
    }, 700);
  },
  //Restarts game after win
  newGame:function() {
    this.isStarted = false;
    newPlayer.isPlayer = false;
    this.clearGame();
    this.enableLgBtn();
  },
  //-----------Logic to count game series/sequence---------//
  //Increases game sequence count and displays count
  incCount:function() {
    this.gameCount++;
    this.showCount();
  },
  //Returns value of gameCount property
  getCount:function() {
    return this.gameCount;
  },
  //Formats gameCount value to 2 digits and displays on count screen
  showCount:function() {
    if(this.getCount() < 10) {
      this.gameCount = "0" + parseInt(this.gameCount);
    }
    var count = document.getElementById(this.countId);
    if(this.isStarted && this.gameOn()) {
      count.innerHTML = this.getCount();
    } else if(!this.isStarted && this.gameOn()) {
      count.innerHTML = '--';
    } else if(!this.isStarted && !this.gameOn()) {
      count.innerHTML = '';
    }
  },
  //Display notification when a wrong button is selected
  wrongChoice:function() {
    var count = document.getElementById(this.countId);
    count.innerHTML = '!!';
  }
}

/*-------------------------------
------------Player object--------
---------------------------------*/

function Player () {
  this.playerSeries = [];
  this.isPlayer = false;
}

Player.prototype = {
  constructor: Player,
  //Plays sound, stores id of button in playerSeries array, calls compareGamePlayer();
  addPlayerSeries:function(el) {
    var audioId = el + "Audio";
    var audio = document.getElementById(audioId);
    audio.play();
    this.playerSeries.push(el);
    myGame.compareGamePlayer();
  },
  //Empties playerSeries array
  clearPlayerSeries:function() {
    this.playerSeries = [];
  },
  //Toggles isPlayer value between true and false
  switchPlayer:function(){
    if(!this.isPlayer) {
      this.clearPlayerSeries();
      this.isPlayer = true;
    } else {
      this.isPlayer = false;
    }
  }
}

//----Create new player and game objects----//
var newPlayer = new Player();
var myGame = new Game("button", "countScreen", "strict");

//----Add event listener to start button----//
//Calls startGame() when clicked
var startBtn = document.getElementById("start");
startBtn.addEventListener("click", function(){
  myGame.startGame(this.id);
});

//----Add event listener to game buttons----//
var playBtn = document.getElementsByClassName("button");
for(var i = 0; i < playBtn.length; i++) {
  playBtn[i].addEventListener("mousedown", function() {
    newPlayer.addPlayerSeries(this.id);
  });
}

//---Add event listener to 'strict' button---//
var strict = document.getElementById("strict");
strict.addEventListener("click", function() {
  myGame.changeStrictMode(this.id);
});

//----Add event listener to 'on' button----//
var onBtn = document.getElementById("toggle");
onBtn.addEventListener("click", function() {
  myGame.onOffToggle(this.id);
});
