const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");

let questions = [];
let currentQuestion = 0;
let score = 0;

async function startQuiz() {
    const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
    );

    const data = await response.json();

    questions = data.results;
    currentQuestion = 0;
    score = 0;

    quizContainer.style.display = "block";
    startBtn.style.display = "none";

    showQuestion();
}

function showQuestion() {
    nextBtn.style.display = "none";

    const question = questions[currentQuestion];

    questionElement.innerHTML =
        `Question ${currentQuestion + 1}: ${question.question}`;

    answersElement.innerHTML = "";

    let answers = [
        ...question.incorrect_answers,
        question.correct_answer
    ];

    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const button = document.createElement("button");

        button.textContent = answer;
        button.classList.add("btn");
        button.style.display = "block";
        button.style.margin = "10px auto";

        button.addEventListener("click", () => selectAnswer(button, answer));

        answersElement.appendChild(button);
    });
}

function selectAnswer(button, answer) {
    const correctAnswer =
        questions[currentQuestion].correct_answer;

    const buttons =
        answersElement.querySelectorAll("button");

    buttons.forEach(btn => {
        btn.disabled = true;

        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = "green";
            btn.style.color = "white";
        }
    });

    if (answer === correctAnswer) {
        score++;
    } else {
        button.style.backgroundColor = "red";
        button.style.color = "white";
    }

    nextBtn.style.display = "inline-block";
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    const percentage =
        Math.round((score / questions.length) * 100);

    let highScore =
        Number(localStorage.getItem("highScore")) || 0;

    let attempts =
        Number(localStorage.getItem("attempts")) || 0;

    attempts++;

    if (percentage > highScore) {
        highScore = percentage;
        localStorage.setItem("highScore", highScore);
    }

    localStorage.setItem("previousScore", percentage);
    localStorage.setItem("attempts", attempts);

    questionElement.innerHTML =
        `Quiz Complete! Your Score: ${percentage}%`;

    answersElement.innerHTML = "";

    nextBtn.style.display = "none";

    updateStats();
}

function updateStats() {
    const stats =
        document.querySelectorAll(".card-text");

    if (stats.length >= 3) {
        stats[0].textContent =
            (localStorage.getItem("previousScore") || 0) + "%";

        stats[1].textContent =
            (localStorage.getItem("highScore") || 0) + "%";

        stats[2].textContent =
            localStorage.getItem("attempts") || 0;
    }
}

if (startBtn) {
    startBtn.addEventListener("click", startQuiz);
}

if (nextBtn) {
    nextBtn.addEventListener("click", nextQuestion);
}

updateStats();
