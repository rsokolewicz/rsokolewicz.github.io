// numberGuessGame.js

let scoreCorrect = 0;
let scoreIncorrect = 0;
let currentNumber = 0;

function startNumberGuessGame() {
    generateVietnameseNumber();
}

let guessesHistory = []; // Stores the last twenty guesses {number: x, correct: boolean}

function updateGuessesHistory(number, correct) {
    guessesHistory.push({number, correct});
    if (guessesHistory.length > 20) {
        guessesHistory.shift(); // Keep only the last twenty records
    }
}

function generateWeightedNumber() {
    let incorrectNumbers = guessesHistory.filter(guess => !guess.correct).map(guess => guess.number);
    // More likely to include numbers that were guessed incorrectly
    let weightedOptions = incorrectNumbers.concat(Array.from({length: 10}, (_, i) => i)).concat(incorrectNumbers); // Basic 0-10 range, plus twice incorrect guesses

    let newNumber;
    do {
        newNumber = weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
    } while(newNumber === lastNumber); // Ensure it's not the same as the last number

    return newNumber;
}


let lastNumber = -1; // Initialize with a value that won't be generated

function generateVietnameseNumber() {
    currentNumber = generateWeightedNumber(); // Use the new weighted number generator
    lastNumber = currentNumber; // Remember the new number as the last number

    const vietnameseNumberElement = document.getElementById('vietnameseNumber');
    vietnameseNumberElement.textContent = convertNumberToVietnamese(currentNumber);
    vietnameseNumberElement.style.backgroundColor = 'transparent'; // Reset background color
}



function convertNumberToVietnamese(number) {
    const numbersInVietnamese = {
        0: 'không', 1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn',
        5: 'năm', 6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười'
    };
    return numbersInVietnamese[number];
}

document.addEventListener("keydown", function(event) {
    if (document.getElementById('NumberGuess').style.display === 'block') {
        const key = event.key;
        if (key >= '0' && key <= '9' || key === '10') {
            let guess = parseInt(key, 10);
            if (key === '10') guess = 10;

            const correct = guess === currentNumber;
            updateGuessesHistory(currentNumber, correct);

            // Update scores based on the guess correctness
            if (correct) {
                scoreCorrect++;
                document.getElementById('vietnameseNumber').style.backgroundColor = '#c8e6c9'; // Pastel green
            } else {
                scoreIncorrect++;
                document.getElementById('vietnameseNumber').style.backgroundColor = '#ffcdd2'; // Pastel red
            }
            document.getElementById('vietnameseNumber').style.backgroundColor = correct ? '#c8e6c9' : '#ffcdd2'; // Pastel colors
            document.getElementById('scoreGuess').textContent = `Correct: ${scoreCorrect} Incorrect: ${scoreIncorrect}`;

            setTimeout(() => {
                document.getElementById('vietnameseNumber').style.backgroundColor = 'transparent'; // Reset background
                generateVietnameseNumber();
            }, 500);
        }
    }
});

