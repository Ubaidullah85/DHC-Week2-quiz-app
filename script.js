// script.js

let currentQuestionIndex = 0;
let questions = [];
let answers = [];

document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('welcome-section').style.display = 'none';
    document.getElementById('instructions-section').style.display = 'block';
});

document.getElementById('start-quiz-button').addEventListener('click', function() {
    document.getElementById('instructions-section').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    fetchQuestions();
});

document.getElementById('next-button').addEventListener('click', function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        document.getElementById('show-score-button').style.display = 'block';
    }
});

document.getElementById('show-score-button').addEventListener('click', function() {
    const correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || [];
    const userAnswers = JSON.parse(localStorage.getItem('quizAnswers')) || [];
    let score = 0;

    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
            score++;
        }
    }

    alert('Your score is ' + score + ' out of ' + userAnswers.length);
});

window.addEventListener('beforeunload', function(event) {
    event.preventDefault();
    event.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
});

function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            const correctAnswers = questions.map(q => q.correct_answer);
            localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
            showQuestion(currentQuestionIndex);
        })
        .catch(error => console.log('Error:', error));
}

function showQuestion(index) {
    const question = questions[index];
    document.getElementById('question').textContent = question.question;
    const options = [...question.incorrect_answers, question.correct_answer];
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';

    options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', function() {
            answers[index] = option;
            localStorage.setItem('quizAnswers', JSON.stringify(answers));
            document.getElementById('next-button').click();
        });
        optionsList.appendChild(li);
    });
}
