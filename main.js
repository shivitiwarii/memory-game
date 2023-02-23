var reveal = []; // array of cards clicked
var revealVals = []; // array of values of cards clicked
var score = 0; // score
var scoreBoard = document.getElementById("score");
var timerDisplay = document.getElementById("timer");
var timeDisplay = 0;
var flag = false; //to prevent users from clicking start button multiple times(for example, when a game is already in progress)
var flagWinner = false; //to prevent the timer from running internally when the game is over

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
  var nums = []; // array of numbers representing cards to be displayed
  for (x = 1; x <= numCard / 3; x++) {
    nums.push(x);
    nums.push(x);
    nums.push(x);
  }
  swappedVals = interchanging(nums); //randomising the numbers
  for (i = 0; i < numCard; i++) {
    var singleCard = document.createElement("div"); //creating an element for each card
    singleCard.setAttribute("id", "card" + i);
    singleCard.setAttribute("class", "card");
    singleCard.addEventListener("click",
      function () {
        if (this.innerHTML == "" && reveal.length < 3) {
          this.style.background = "#DDA0DD";
          var number = parseInt(this.id.replace("card", "")); //check if u can modify this
          this.textContent = swappedVals[number];
          reveal.push(this);
          revealVals.push(swappedVals[number]);
          if (reveal.length == 3) {
            findTriplet();
          }
        }
      }
    );
    cards.appendChild(singleCard);
  }
  return true;
}

var counter = 0; //to keep track of the number of triplets hit
function findTriplet() {
  //const turnedOverCards = document.querySelectorAll('.turned-over');
  const numOfCards = document.getElementById("levelInput").value; // number of cards
  //if this is true triplet is found
  if (revealVals[0] == revealVals[1] && revealVals[1] == revealVals[2]) {
    //keep track of number of triplets found to end the game when all triplets are found  
    counter++;
    for (i = 0; i < reveal.length; i++) {
      reveal[i].textContent = "";
      reveal[i].style.display = "none";
    }
    score += 8;
    reveal = [];
    revealVals = [];
  }
  else {
    score -= 3;
    setTimeout(function () {
      for (i = 0; i < reveal.length; i++) {
        reveal[i].textContent = "";
        reveal[i].style.backgroundColor = "";
      }
      reveal = [];
      revealVals = [];
    }, 500);
  }
  //game ends if number of triplets found = number of cards/3
  if (counter == numOfCards / 3) {
    counter = 0;
    alertWinner();
    location.reload();
  }
  scoreBoard.textContent = score;
}

//allows to alert the winner and end the game
function alertWinner() {
  alert("You win! Your score is " + score + "");
  flagWinner = true;
  timeDisplay = 0;
  // timerDisplay.innerHTML = "&#9203 Time elapsed " + timeDisplay;
  score = 0;
  clearInterval(interval);
}

// function to shuffle the cards
function interchanging(nums) {
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
    var begin = new Date().getTime();
    interval = setInterval(function () {
      var current = new Date().getTime();
      var diff = current - begin;
      timeDisplay++;
      timerDisplay.innerHTML = "&#9203 Time elapsed " + Math.floor(diff / 1000) + "s/60s";
    }, 1000);
  }

//this function allows to end the game after 1 minute
function timeOut() {
  setTimeout(function () {
    if (flagWinner == false) {
      clearInterval(interval);
      alert("Game Over! Your score is " + score);
      location.reload();
    }
  }, 60000 - (timeDisplay * 1000));
}


//starting point of the game, everything starts when start button is clicked
//1. validates the number of cards entered
//2. calls the function to display the cards
//3. starts the timer
startBtn.addEventListener("click", function () {
  let textBoxVal = document.getElementById("levelInput").value;
  const inputBox = document.getElementById("levelInput");

  if (textBoxVal > 24 || textBoxVal < 6 || textBoxVal % 3 != 0) {
    alert("Please enter a valid number in the range 6-24!");
    location.reload();
  }
  if (!flag && textBoxVal.length != 0 && textBoxVal % 3 == 0 && textBoxVal <= 24 && textBoxVal >= 6) {
    flag = true;
    flagWinner = false;
    inputBox.disabled = true;
    score = 0;
    // call function to display the cards
    dynamicDisplay();
    timer();      //start timer
    timeOut();    //start timeout function to end game after 1 minute
  }
});



