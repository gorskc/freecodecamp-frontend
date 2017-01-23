//Create function to visually illustrate timer progress
function Timer(displayId, typeId, sessionId, breakId) {
  this.typeId = typeId;
  this.displayId = displayId;
  this.sessionId = sessionId;
  this.breakId = breakId;
  this.seconds = '';
  this.minutes = '';
  this.time = '';
  this.onBreak = false;
  this.started = '';
  this.count = 0;
}
//Increase and set time for timer
Timer.prototype.increaseTime = function(setTimeId) {
  if(document.getElementById(setTimeId).innerHTML++ > 59) {
    document.getElementById(setTimeId).innerHTML = this.minutes;
  }
  this.displayTime();
}
//Decrease and set time for timer
Timer.prototype.decreaseTime = function(setTimeId) {
  if(document.getElementById(setTimeId).innerHTML-- < 1) {
    document.getElementById(setTimeId).innerHTML = parseInt(this.minutes);
  }
  this.displayTime();
}

Timer.prototype.displayTime = function() {
  this.time = document.getElementById(this.sessionId).innerHTML * 60;
  this.toString();
  document.getElementById(this.typeId).innerHTML = document.getElementById(this.sessionId).title;
}

Timer.prototype.intervalTime = function() {
  myTimer.toSeconds();
  myTimer.counter();
  if(myTimer.time-- <= 0) {
    myTimer.switchTime();
  }
  myTimer.toString();
}
//use decreasing time in startTime to update the display
//converts total seconds into minutes and seconds and updates this.time;
Timer.prototype.startTime = function() {
  this.started = setInterval(this.intervalTime, 1000);
}

Timer.prototype.stopTime = function() {
  clearInterval(this.started);
}

Timer.prototype.disableButtons = function(btnClass) {
  var buttons = document.getElementsByClassName(btnClass);
  for(var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

Timer.prototype.enableButtons = function(btnClass) {
  var buttons = document.getElementsByClassName(btnClass);
  for(var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
}

Timer.prototype.toString = function() {
  this.minutes = Math.floor(this.time / 60);
  this.seconds = Math.floor(this.time % 60);
  this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
  this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
  this.time = this.minutes + ':' + this.seconds;
  document.getElementById(this.displayId).innerHTML = this.time;
}

Timer.prototype.toSeconds = function() {
  var total = document.getElementById(this.displayId).innerHTML;
  total = total.split(":");
  this.time = (total[0] * 60) + Number(total[1]);
}

Timer.prototype.getTime = function(btnClass) {
  this.toSeconds();
  if(this.started) {
    this.stopTime();
    this.started = undefined;
    this.enableButtons(btnClass);
  } else {
    this.startTime();
    this.disableButtons(btnClass);
  }
}

//reset
Timer.prototype.switchTime = function() {
  if(this.onBreak === false) {
    this.onBreak = true;
    this.time = document.getElementById(this.sessionId).innerHTML * 60;
    document.getElementById(this.typeId).innerHTML = document.getElementById(this.sessionId).title;
  } else if(this.onBreak === true) {
    this.onBreak = false;
    this.time = document.getElementById(this.breakId).innerHTML * 60;
    document.getElementById(this.typeId).innerHTML = document.getElementById(this.breakId).title;
  }
}

//Use for setInterval to calculate percentage of time passed and add
Timer.prototype.counter = function() {
  this.count++;
  var percElap = this.count / (this.count + this.time) * 100;
  //var deg = percElap * 360;
  var elem = document.getElementById("progress");
  elem.style.height = percElap + '%';
}

var myTimer = new Timer('displayTime', 'timerType', 'sessionTime', 'breakTime');
var sessionUp = document.getElementById('upSession');
var sessionDown = document.getElementById('downSession');
var breakUp = document.getElementById('upBreak');
var breakDown = document.getElementById('downBreak');
var timerArea = document.getElementById('progress');

sessionUp.addEventListener("click", function() {
  myTimer.increaseTime('sessionTime');
});
sessionDown.addEventListener("click", function() {
  myTimer.decreaseTime('sessionTime');
});

breakUp.addEventListener("click", function() {
  myTimer.increaseTime('breakTime');
});
breakDown.addEventListener("click", function() {
  myTimer.decreaseTime('breakTime');
});

function init() {
  myTimer.displayTime();
}
window.onload = init;

timerArea.addEventListener("click", function(){
  myTimer.getTime('btn');
});
