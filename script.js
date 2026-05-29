// Load tasks from browser storage when page opens
window.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    if (deadlineInput.value === '') {
        alert('Please set a deadline!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        deadline: deadlineInput.value,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
    deadlineInput.value = '';

    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-message">No tasks yet. Add one to get started!</div>';
        updateProgress();
        return;
    }

    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');

        const today = new Date();
        const deadline = new Date(task.deadline);
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        const isUrgent = daysLeft <= 3 && daysLeft > 0;

        li.innerHTML = `
            <input 
                type="checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            >

            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-deadline ${isUrgent ? 'urgent' : ''}">
                    📅 Due: ${formatDate(task.deadline)}
                    ${isUrgent && !task.completed ? ' ⚠️ Due soon!' : ''}
                </div>
            </div>

            <button class="delete-btn" onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    updateProgress();
}

function toggleTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.id !== id);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ENTER KEY SUPPORT
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// MUSIC BUTTON (circle now)
function openMusic() {
    window.open(
        "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        "_blank"
    );
}

// PROGRESS BAR
function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (tasks.length === 0) {
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').innerText = '0% Complete';
        return;
    }

    const completedTasks = tasks.filter(task => task.completed).length;

    const percentage = Math.round((completedTasks / tasks.length) * 100);

    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('progressText').innerText = `${percentage}% Complete`;
}