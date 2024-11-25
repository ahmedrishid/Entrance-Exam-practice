let currentUser = null;
let currentQuestion = 0;
let questions = [];
let answers = new Array(100).fill(null);
let timeLeft = 180 * 60;
let timerInterval;

const subjects = {
    'Natural Science': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Civic', 'Aptitude'],
    'Social Science': ['Geography', 'History', 'Economics', 'English', 'Mathematics', 'civic', 'Aptitude']
};

function toggleAuth() {
    const form = document.getElementById('loginForm');
    const heading = document.querySelector('.auth-container h2');
    if (heading.textContent === 'Sign In') {
        heading.textContent = 'Sign Up';
        form.innerHTML += '<input type="text" placeholder="Full Name" required>';
    } else {
        heading.textContent = 'Sign In';
        form.querySelector('input[placeholder="Full Name"]')?.remove();
    }
}

document.getElementById('streamSelect').addEventListener('change', function() {
    const streamSelect = document.getElementById('streamSelect');
    const subjectSelect = document.getElementById('subjectSelect');
    const selectedStream = streamSelect.value;

    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    if (selectedStream && subjects[selectedStream]) {
        subjects[selectedStream].forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }
});

function initializeExam() {
    questions = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        question: `Sample question ${i + 1} for your exam`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: Math.floor(Math.random() * 4)
    }));

    const progressContainer = document.getElementById('questionProgress');
    progressContainer.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const box = document.createElement('div');
        box.className = 'progress-box';
        box.textContent = i + 1;
        box.onclick = () => showQuestion(i);
        progressContainer.appendChild(box);
    }

    showQuestion(0);
    startTimer();
}

function showQuestion(index) {
    currentQuestion = index;
    const question = questions[index];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question-header">
            <h3>Question ${question.id} of 100</h3>
        </div>
        <div class="question-text">${question.question}</div>
        <div class="options-container">
            ${question.options.map((opt, i) => `
                <label class="option-item">
                    <input type="radio" name="q${index}" value="${i}" 
                        ${answers[index] === i ? 'checked' : ''}>
                    ${opt}
                </label>
            `).join('')}
        </div>
    `;

    updateProgress();
}

function updateProgress() {
    document.querySelectorAll('.progress-box').forEach((box, i) => {
        box.classList.remove('active');
        box.classList.toggle('answered', answers[i] !== null);
        if (i === currentQuestion) box.classList.add('active');
    });
}

function updateExamInfo() {
    const stream = document.getElementById('streamSelect').value;
    const year = document.getElementById('yearSelect').value;
    const subject = document.getElementById('subjectSelect').value;
    
    document.getElementById('examInfoDisplay').innerHTML = `
        <strong>Stream:</strong> ${stream}<br>
        <strong>Year:</strong> ${year}<br>
        <strong>Subject:</strong> ${subject}
    `;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timeLeft = 180 * 60;
    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function previousQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function nextQuestion() {
    if (currentQuestion < 99) {
        showQuestion(currentQuestion + 1);
    }
}

function submitExam() {
    clearInterval(timerInterval);
    const correct = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct ? 1 : 0);
    }, 0);

    document.getElementById('examContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    document.getElementById('scoreDisplay').textContent = 
        `You got ${correct} questions correct out of 100 (${correct}%)`;
}

function startNewExam() {
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('examSetupContainer').style.display = 'block';
    answers = new Array(100).fill(null);
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('examSetupContainer').style.display = 'block';
});

document.getElementById('examSetupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('examSetupContainer').style.display = 'none';
    document.getElementById('examContainer').style.display = 'block';
    updateExamInfo();
    initializeExam();
});

document.getElementById('examContainer').addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        answers[currentQuestion] = parseInt(e.target.value);
        updateProgress();
    }
});