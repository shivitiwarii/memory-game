
var clicked = []; // array of cards clicked
var clickedVals = []; // array of values of cards clicked
var score = 0; // score
var scoreBoard = document.getElementById("score");
var timerDisplay = document.getElementById("timer");
var timeDisplay = 0;
var flag = false; //to prevent users from clicking start button multiple times(for example, when a game is already in progress)
var flagWinner = false; //to prevent the timer from running internally when the game is over
var invalid = false;  //to prevent the timer from starting if invalid number of cards are entered

//code to handle the instruction modal box 
var modal = document.getElementById("modalBox");
var button = document.getElementsByClassName("instruction")[0];
var span = document.getElementsByClassName("close")[0];

button.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

cards = document.getElementById("cards"); // array of cards
startBtn = document.getElementById("startBtn"); // start button
resetBtn = document.getElementById("resetBtn"); // reset button
resetBtn.addEventListener("click", function () {
  location.reload();
});

//dynamically display cards on the screen
function dynamicDisplay() {
  var numCard = document.getElementById("levelInput").value; // getting the number of cards inputted by user
  cards.innerHTML = "";
  invalid = false;
  var nums = []; // array of numbers representing cards to be displayed
  for (x = 1; x <= numCard / 3; x++) {
    nums.push(x);
    nums.push(x);
    nums.push(x);
  }
  randomNums = randomiseNums(nums); // shuffle the cards
  for (i = 0; i < numCard; i++) {
    if (numCard % 3 != 0) {
      //if user enter a value not a multiple of 3, alert them
      alert("Please enter a number divisible by 3");
      invalid = true;
      location.reload();
      return;
    }
    var individualCard = document.createElement("div"); //creating an element for each card
    individualCard.setAttribute("id", "card" + i);
    individualCard.setAttribute("class", "card");
    individualCard.addEventListener("click",
      function () {
        if (this.innerHTML == "" && clicked.length < 3) {
          this.style.background = "#DDA0DD";
          var number = parseInt(this.id.replace("card", "")); //check if u can modify this
          this.textContent = randomNums[number];
          clicked.push(this);
          clickedVals.push(randomNums[number]);
          if (clicked.length == 3) {
            identifyTriplet();
          }
        }
      }
    );
    cards.appendChild(individualCard);
  }
}

var counter = 0; //to keep track of the number of triplets hit
function identifyTriplet() {
  //const turnedOverCards = document.querySelectorAll('.turned-over');
  const numOfCards = document.getElementById("levelInput").value; // number of cards
  //if this is true triplet is found
  if (clickedVals[0] == clickedVals[1] && clickedVals[1] == clickedVals[2]) {
    //keep track of number of triplets found to end the game when all triplets are found  
    counter++;
    for (i = 0; i < clicked.length; i++) {
      clicked[i].textContent = "";
      //clicked[i].style.background = "#66CDAA";
      clicked[i].style.display = "none";
    }
    score += 8;
    clicked = [];
    clickedVals = [];
  }
  else {
    score -= 3;
    setTimeout(function () {
      for (i = 0; i < clicked.length; i++) {
        clicked[i].textContent = "";
        clicked[i].style.backgroundColor = "";
      }
      clicked = [];
      clickedVals = [];
    }, 500);
  }
  
  //game ends if number of triplets found = number of cards/3
  if (counter == numOfCards / 3) {
    counter = 0;
    alertWinner();
  }
  scoreBoard.textContent = score;
}


//allows to alert the winner and end the game
function alertWinner() {
  alert("You win! Your score is " + score + "");
  flagWinner = true;
  timeDisplay = 0;
  timerDisplay.innerHTML = "&#9203 Time elapsed " + timeDisplay;
  score = 0;
  clearInterval(interval);
}


// function to shuffle the cards
function randomiseNums(nums) {
  for (i = 0; i < nums.length; i++) {
    x = Math.floor(Math.random() * (i + 1));
    var swap = nums[i];
    nums[i] = nums[x];
    nums[x] = swap;
  }
  return nums;
}

//this function takes the difference between the current and start of timer to display the time elapsed
//since the game starts 
var interval;
function timer() {
    if (!invalid) {
    invalid = false;
    var begin = new Date().getTime();
    interval = setInterval(function () {
      var current = new Date().getTime();
      var diff = current - begin;
      timeDisplay++;
      timerDisplay.innerHTML = "&#9203 Time elapsed " + Math.floor(diff / 1000) + "s/60s";
    }, 1000);
  }
}

//this function allows to end the game after 1 minute
function timeOut() {
  setTimeout(function () {
    if (flagWinner == false) {
      clearInterval(interval);
      alert("Game Over! Your score is " + score);
    }
  }, 60000 - (timeDisplay * 1000));
}


startBtn.addEventListener("click", function () {
  if (!flag) {
    flag = true;
    flagWinner = false;
    score = 0;
    // call function to display the cards
    dynamicDisplay();
    //start timer
    timer();
    //start timeout function to end game after 1 minute
    timeOut();
  }
});



