let score = 0;

function generateQuestion() {
    const num1 = Math.ceil(Math.random() * 10);
    const num2 = Math.ceil(Math.random() * 10);
    const correctAnswer = num1 + num2;

    // Assuming a function to convert numbers to their Vietnamese representation
    // For numbers > 10, you would need to extend your dictionary or logic
    const questionText = `${convertNumberToVietnamese(num1)} + ${convertNumberToVietnamese(num2)}`;
    document.getElementById('question').textContent = questionText;

    const choices = generateChoices(correctAnswer);
    displayChoices(choices, correctAnswer);
}

function generateChoices(correctAnswer) {
    let choicesSet = new Set([correctAnswer]);
    while (choicesSet.size < 4) {
        // Generate near numbers for choices, ensuring they're within a reasonable range
        let nearNumber = correctAnswer + Math.floor(Math.random() * 7) - 3; // Generate numbers in a range around the correct answer
        if (nearNumber > 0) choicesSet.add(nearNumber); // Ensure no negative numbers
    }

    // Convert the Set to an Array and shuffle it
    let choices = Array.from(choicesSet);
    choices = choices.sort(() => Math.random() - 0.5);
    return choices;
}

function displayChoices(choices, correctAnswer) {
    const choicesElement = document.getElementById('choices');
    choicesElement.innerHTML = '';
    choices.forEach(choice => {
        const choiceElement = document.createElement('div');
        choiceElement.textContent = convertNumberToVietnamese(choice); // Convert choices to Vietnamese
        choiceElement.onclick = function() { selectChoice(choice, correctAnswer); };
        choicesElement.appendChild(choiceElement);
    });
}

function selectChoice(selected, correct) {
    const choicesElement = document.getElementById('choices').children;
    let correctElement, selectedElement;

    for (let i = 0; i < choicesElement.length; i++) {
        if (choicesElement[i].textContent === convertNumberToVietnamese(correct)) {
            correctElement = choicesElement[i];
        }
        if (choicesElement[i].textContent === convertNumberToVietnamese(selected)) {
            selectedElement = choicesElement[i];
        }
    }

    if (selected === correct) {
        selectedElement.classList.add('correct');
    } else {
        selectedElement.classList.add('wrong');
        correctElement.classList.add('correct');
    }

    setTimeout(() => {
        // Reset classes for the next question
        Array.from(choicesElement).forEach(element => element.className = '');
        if (selected === correct) {
            score++;
            document.getElementById('score').textContent = `Score: ${score}`;
        }
        generateQuestion();
    }, 500); // Wait 0.5 seconds before moving to the next question
}



function highlightCorrectAnswer(correctAnswer) {
    const choices = document.getElementById('choices').children;
    for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        if (parseInt(choice.textContent) === correctAnswer) { // Assuming direct comparison for simplicity
            choice.classList.add('correct');
        } else {
            choice.classList.add('wrong');
        }
    }
}

function convertNumberToVietnamese(number) {
    const numberToVietnamese = {
        1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm',
        6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười',
        11: 'mười một', 12: 'mười hai', 13: 'mười ba', 14: 'mười bốn', 15: 'mười lăm',
        16: 'mười sáu', 17: 'mười bảy', 18: 'mười tám', 19: 'mười chín', 20: 'hai mươi'
    };

    return numberToVietnamese[number] || number.toString();
}


// Debug: Check if the script reaches this point and can generate questions
console.log("Script loaded. Generating first question.");
generateQuestion();
