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
