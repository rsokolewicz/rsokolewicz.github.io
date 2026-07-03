// Function to open a specific game tab
function openGame(evt, gameName) {
    var tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(gameName).style.display = "block";
    evt.currentTarget.className += " active";
  
    if (gameName === "NumberGuess") {
      startNumberGuessGame();
    }
  }
  
  // Mapping for Vietnamese numbers 0-10
  const numberToVietnamese = {
    0: 'không', 1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 
    5: 'năm', 6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười'
  };
  
  let currentNumber = 0; // The number currently displayed
  let correctAnswers = 0; // Total correct answers
  let incorrectAnswers = 0; // Total incorrect answers
  
  function displayNewNumber() {
    currentNumber = Math.floor(Math.random() * 11); // Random number between 0 and 10
    document.getElementById('vietnameseNumber').textContent = numberToVietnamese[currentNumber];
    document.getElementById('vietnameseNumber').style.backgroundColor = ''; // Reset background color
  }
  
  function updateScore() {
    document.getElementById('scoreGuess').textContent = `Correct: ${correctAnswers} Incorrect: ${incorrectAnswers}`;
  }
  
  function startNumberGuessGame() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateScore();
    displayNewNumber();
  
    // Attach the keydown event listener specifically for this game
    document.addEventListener('keydown', handleNumberGuess);
  }
  
  function handleNumberGuess(event) {
    // Ensure we only accept number key presses and ignore others like Alt+Tab
    if (event.key >= 0 && event.key <= 9) {
      let guess = parseInt(event.key);
      checkGuess(guess);
    } else if (event.key === '0' && currentNumber === 10) { // Special case for "10" as "0" being the second digit
      // Wait for potential second digit
      setTimeout(() => {
        if (currentNumber === 10) {
          checkGuess(10);
        }
      }, 500); // Wait 0.5s for a user to possibly press "1" after "0" for "10"
    }
  }
  
  function checkGuess(guess) {
    let isCorrect = guess === currentNumber;
    if (isCorrect) {
      correctAnswers++;
      document.getElementById('vietnameseNumber').style.backgroundColor = '#c8e6c9'; // Pastel green
    } else {
      incorrectAnswers++;
      document.getElementById('vietnameseNumber').style.backgroundColor = '#ffcdd2'; // Pastel red
    }
    updateScore();
    setTimeout(displayNewNumber, 500); // Wait 0.5 seconds before showing the next number
  }
  
  // Initial call to set up the first game or tab as active on load
  document.addEventListener('DOMContentLoaded', () => {
    openGame({ currentTarget: document.querySelector('.tablinks') }, 'Arithmetic'); // Default to opening the first game
  });
  