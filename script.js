// Load tasks from browser storage when page opens
window.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    
    // Check if user entered something
    if (taskInput.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }
    
    if (deadlineInput.value === '') {
        alert('Please set a deadline!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(), // Unique ID using timestamp
        text: taskInput.value,
        deadline: deadlineInput.value,
        completed: false
    };
    
    // Get existing tasks from storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Add new task
    tasks.push(task);
    
    // Save to storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Clear inputs
    taskInput.value = '';
    deadlineInput.value = '';
    
    // Refresh the display
    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Clear the list
    taskList.innerHTML = '';
    
    // If no tasks, show message
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-message">No tasks yet. Add one to get started!</div>';
        return;
    }
    
    // Sort tasks by deadline
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    // Display each task
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        
        // Check if deadline is soon (within 3 days)
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
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
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

// Allow pressing Enter to add task
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});