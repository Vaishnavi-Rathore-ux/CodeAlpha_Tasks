let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function addTask() {
    const text = document.getElementById("taskInput").value;
    const priority = document.getElementById("priority").value;
    const date = document.getElementById("date").value;
    if (!text) {
        alert("Enter task!");
        return;
    }
    tasks.push({ text, priority, date, completed: false });
    saveTasks();
    renderTasks();
    document.getElementById("taskInput").value = "";
}
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}
function renderTasks() {
    const list = document.getElementById("taskList");
    const search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    let filtered = tasks.filter(task =>
        task.text.toLowerCase().includes(search)
    );

    filtered.forEach(task => {

        const originalIndex = tasks.indexOf(task);

        const div = document.createElement("div");
        div.className = `task ${task.priority} ${task.completed ? 'completed' : ''}`;

        div.innerHTML = `
            <div>
                <strong>${task.text}</strong><br>
                <small>${task.date}</small>
            </div>
            <div class="actions">
                <button onclick="toggleComplete(${originalIndex})">✔</button>
                <button onclick="deleteTask(${originalIndex})">❌</button>
            </div>
        `;

        list.appendChild(div);
    });

    document.getElementById("count").innerText = `Total: ${tasks.length}`;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

renderTasks();