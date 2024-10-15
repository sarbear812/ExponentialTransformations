const questions = {
    easy: [
        {
            description: "Shift the function \\(f(x) = 2^x\\) up by 3 units.",
            correctAnswer: "\\(f(x) = 2^x + 3\\)",
            options: [
                "\\(f(x) = 2^x - 3\\)",
                "\\(f(x) = 2^{x + 3}\\)",
                "\\(f(x) = 2^x + 3\\)",
                "\\(f(x) = 3^{x}\\)",
                "\\(f(x) = 2^{x - 3}\\)"
            ]
        },
        {
            description: "Reflect the function \\(f(x) = e^x\\) over the x-axis.",
            correctAnswer: "\\(f(x) = -e^x\\)",
            options: [
                "\\(f(x) = -e^x\\)",
                "\\(f(x) = e^{-x}\\)",
                "\\(f(x) = e^x + 1\\)",
                "\\(f(x) = e^{x + 1}\\)",
                "\\(f(x) = -e^{-x}\\)"
            ]
        }
    ],
    medium: [
        {
            description: "Shift the function \\(f(x) = 3^x\\) right by 2 units and down by 1 unit.",
            correctAnswer: "\\(f(x) = 3^{(x - 2)} - 1\\)",
            options: [
                "\\(f(x) = 3^{(x + 2)} - 1\\)",
                "\\(f(x) = 3^{(x - 2)} + 1\\)",
                "\\(f(x) = 3^{(x - 2)} - 1\\)",
                "\\(f(x) = 3^{(x - 1)} - 2\\)",
                "\\(f(x) = 3^x - 1\\)"
            ]
        },
        {
            description: "Stretch the function \\(f(x) = e^x\\) vertically by a factor of 2 and reflect it over the y-axis.",
            correctAnswer: "\\(f(x) = -2e^{-x}\\)",
            options: [
                "\\(f(x) = -2e^{-x}\\)",
                "\\(f(x) = 2e^{x}\\)",
                "\\(f(x) = -e^{2x}\\)",
                "\\(f(x) = 2e^{x}\\)",
                "\\(f(x) = 2 - e^{x}\\)"
            ]
        }
    ],
    hard: [
        {
            description: "Shift the function \\(f(x) = e^x\\) left by 1 unit and stretch it vertically by a factor of 3.",
            correctAnswer: "\\(f(x) = 3e^{(x + 1)}\\)",
            options: [
                "\\(f(x) = 3e^{(x + 1)}\\)",
                "\\(f(x) = e^{3x + 1}\\)",
                "\\(f(x) = 3e^{x + 1}\\)",
                "\\(f(x) = 3e^{-x + 1}\\)",
                "\\(f(x) = e^{(x + 3)}\\)"
            ]
        },
        {
            description: "Reflect the function \\(f(x) = 4^x\\) over the x-axis and shift it down by 5 units.",
            correctAnswer: "\\(f(x) = -4^x - 5\\)",
            options: [
                "\\(f(x) = -4^x - 5\\)",
                "\\(f(x) = -4^{(x - 5)}\\)",
                "\\(f(x) = 4^x - 5\\)",
                "\\(f(x) = -4^x + 5\\)",
                "\\(f(x) = -5^{(x)}\\)"
            ]
        }
    ]
};

let totalScore = 0;
let currentQuestionIndex = 0;
let shuffledQuestions = [];
let questionAnswered = false;
let scoreRows = 0;

// Function to shuffle the questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to start the quiz
function startQuiz() {
    shuffledQuestions = [...questions.easy, ...questions.medium, ...questions.hard];
    shuffleArray(shuffledQuestions);
    loadQuestion();
}

// Function to load the current question
function loadQuestion() {
    if (shuffledQuestions.length === 0) {
        document.getElementById('transformation-description').innerHTML = "No more questions available.";
        document.getElementById('answer-options').innerHTML = '';
        return;
    }

    const question = shuffledQuestions[currentQuestionIndex];

    document.getElementById('transformation-description').innerHTML = question.description;
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    questionAnswered = false;
    document.getElementById('next-btn').disabled = true;

    question.options.forEach((option) => {
        const li = document.createElement('li');
        li.innerHTML = option;
        li.onclick = () => {
            if (!questionAnswered) checkAnswer(option, li);
        };
        answerOptions.appendChild(li);
    });

    document.getElementById('feedback').innerHTML = '';
    MathJax.typesetPromise();
}

// Function to check the selected answer
function checkAnswer(selectedOption, selectedElement) {
    const correctAnswer = shuffledQuestions[currentQuestionIndex].correctAnswer;
    let points = 0;

    if (selectedOption === correctAnswer) {
        points = 20;
        selectedElement.style.backgroundColor = 'green';
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        points = -5;
        selectedElement.style.backgroundColor = 'red';
        document.getElementById('feedback').innerText = 'Incorrect.';
    }

    totalScore += points;
    questionAnswered = true;

    const answerOptions = document.querySelectorAll('#answer-options li');
    answerOptions.forEach(option => option.style.pointerEvents = 'none');

    updateScoreSheet(correctAnswer, points, totalScore);
    document.getElementById('next-btn').disabled = false; // Enable next button
    MathJax.typesetPromise();
}

// Function to update the score sheet
function updateScoreSheet(correctAnswer, points, runningTotal) {
    const scoreSheet = document.getElementById('score-sheet').querySelector('tbody');

    if (scoreRows < 11) {
        const row = document.createElement('tr');
        const correctAnswerCell = document.createElement('td');
        const pointsCell = document.createElement('td');
        const totalScoreCell = document.createElement('td');

        correctAnswerCell.innerHTML = correctAnswer;
        pointsCell.innerText = points;
        totalScoreCell.innerText = runningTotal;

        row.appendChild(correctAnswerCell);
        row.appendChild(pointsCell);
        row.appendChild(totalScoreCell);

        scoreSheet.appendChild(row);
        scoreRows++;
    } else {
        const totalRow = document.createElement('tr');
        const totalCell = document.createElement('td');
        totalCell.colSpan = 2;
        totalCell.innerText = "Total Score:";

        const finalTotalCell = document.createElement('td');
        finalTotalCell.innerText = runningTotal;

        totalRow.appendChild(totalCell);
        totalRow.appendChild(finalTotalCell);

        // Reset the score sheet for next set of rows
        scoreRows = 0;
        // Clear existing rows
        while (scoreSheet.firstChild) {
            scoreSheet.removeChild(scoreSheet.firstChild);
        }

        // Append the new total row after clearing
        scoreSheet.appendChild(totalRow);
    }
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++;

    // If current question index exceeds shuffled questions length, reset and shuffle again
    if (currentQuestionIndex >= shuffledQuestions.length) {
        currentQuestionIndex = 0;
        shuffledQuestions = [...questions.easy, ...questions.medium, ...questions.hard]; // Refill the question bank
        shuffleArray(shuffledQuestions);
    }

    loadQuestion();
});

// Initialize quiz on window load
window.onload = startQuiz;
