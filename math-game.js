document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

let questions = [];
let currentQuestionIndex = 0;
let timer;

function startGame() {
    generateQuestions();
    displayQuestion();
    startTimer(10 * 60); // 10 minutes
}

function generateQuestions() {
    const numQuestions = 20; // or any large number since the game ends based on time
    const randomNumbers = () => Math.floor(Math.random() * 100);
    const randomSmallNumber = () => Math.floor(Math.random() * 10);

    for (let i = 0; i < numQuestions; i++) {
        let number1 = randomNumbers();
        let number2 = randomNumbers();
        let number3 = randomNumbers();
        let number4 = randomSmallNumber();
        let operation = Math.floor(Math.random() * 4); // Randomly select operation: 0-add, 1-subtract, 2-multiply, 3-divide
        let question, answer;

        switch (operation) {
            case 0:
                question = `${number1} + ${number2}`;
                answer = number1 + number2;
                break;
            case 1:
                question = `${number1} - ${number2}`;
                answer = number1 - number2;
                break;
            case 2:
                question = `${number3} * ${number4}`;
                answer = number3 * number4;
                break;
            case 3:
                while (number4 === 0) {
                    number4 = randomSmallNumber();
                }
                question = `${number3} / ${number4}`;
                answer = (number3 / number4).toFixed(2);
                break;
        }

        questions.push({ question, answer });
    }
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('question').innerText = `What is the answer to the following math problem? ${questions[currentQuestionIndex].question}`;
    } else {
        endGame();
    }
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const correctAnswer = parseFloat(questions[currentQuestionIndex].answer);

    if (Math.abs(userAnswer - correctAnswer) < 0.01) { // Allow small margin for floating point comparison
        document.getElementById('result').innerText = "Correct!";
    } else {
        document.getElementById('result').innerText = `Sorry, wrong answer. The correct answer is ${correctAnswer}.`;
    }

    currentQuestionIndex++;
    document.getElementById('answer').value = '';
    displayQuestion();
}

function startTimer(duration) {
    let timerDisplay = document.getElementById('timer');
    let timeRemaining = duration;

    timer = setInterval(() => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.innerText = `Time Remaining: ${minutes}:${seconds}`;

        if (--timeRemaining < 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    document.getElementById('question').innerText = 'Game Over!';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}