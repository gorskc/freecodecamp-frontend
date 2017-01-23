/*This program is based on code from the following source:
https://www.gorkahernandez.com/blog/fcc-zipline-series-build-javascript-calculator-vanilla/
Methods were edited to alter the way numbers were processed and HTML entities were converted; however,
some methods are the same*/

function Calculator(displayId) {
  this.displayId = displayId;
  //Display and calculate final result
  this.equationArr = [];
}
//update display with input
Calculator.prototype.updateDisplay = function() {
  document.getElementById(this.displayId).innerHTML = this.convertArr().join(' ');
}

//Add new input to end of most recent input
Calculator.prototype.addToEntry = function(entry) {
  this.equationArr[this.equationArr.length - 1] += entry;
}

//Push numbers to arrays or add to end of previous entry
//push numbers to arrays unless previous entry is a number or a decimal
Calculator.prototype.processNums = function(number){
  if(!/\d|\d+|[.]/.test(this.getLastEntry()) || !/\d|\d+|[.=]/.test(number)) {
    this.equationArr.push(number);
  } else if (number !== '=') {
    this.addToEntry(number);
  }
  this.updateDisplay();
}

//Get last entry of array
Calculator.prototype.getLastEntry = function() {
  return this.equationArr[this.equationArr.length - 1];
}

//Convert displayArr to equationArr
Calculator.prototype.convertArr = function() {
  htmlEntities={
    '.':'&period;',
    '=':'&equals;',
    '+':'&plus;',
    '-':'&minus;',
    '*':'&times;',
    '/':'&divide;'
  };

  return this.equationArr.map(function(entity){
    if(entity !== '=') {
      return htmlEntities[entity] || entity;
    }
  });
}

//Calculate final result
Calculator.prototype.getResult = function() {
  try {
    var result = eval(this.equationArr.join(' '));
  } catch (e) {
    e.message = 'Error';
    result = (e.message.toString());
  }
  if(result.toString().length > 11) {
    result = result.toFixed(10);
  }
  this.equationArr = [result];
  this.updateDisplay();
}

//Clear all stored data
Calculator.prototype.clearAll = function() {
  this.equationArr = [];
  this.updateDisplay();
}

//Clear last entry
Calculator.prototype.clearEntry = function() {
  this.equationArr.pop();
  this.updateDisplay();
}
var myCalculator = new Calculator('displayVal');
var numbers = document.getElementsByClassName('val');
var solve = document.getElementById('btnEqual');
var clearLast = document.getElementById('btnCe');
var clearAll = document.getElementById('btnAc');

clearLast.addEventListener("click", function(){
  myCalculator.clearEntry();
});

clearAll.addEventListener("click", function(){
  myCalculator.clearAll();
});

solve.addEventListener("click", function(){
  myCalculator.getResult();
});

for(var i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("click", function(){
    myCalculator.processNums(this.getAttribute('value'));
  });
}
