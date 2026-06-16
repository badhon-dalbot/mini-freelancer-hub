const API_BASE_URL = "https://freelancerhubbackend.onrender.com";

// ==========================
// AUTH
// ==========================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token) {
    alert("Please login first.");
    window.location.href = "/pages/signin.html";
}

// ==========================
// DOM
// ==========================
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const refreshBtn = document.getElementById("refreshBtn");
const message = document.getElementById("message");

// ==========================
// MESSAGE
// ==========================
function showMessage(text, type = "success") {

    message.innerHTML = text;
    message.className = type;

    setTimeout(() => {
        message.innerHTML = "";
        message.className = "";
    }, 3000);
}

// ==========================
// CREATE TASK
// ==========================
async function createTask(e) {

    e.preventDefault();

    const body = {
        freelancer_id: document.getElementById("freelancer_id").value.trim(),
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        category_id: Number(document.getElementById("category_id").value),
        delivery_days: Number(document.getElementById("delivery_days").value)
    };

    try {

        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(body)
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            throw new Error(data.message || "Failed to create task");
        }

        showMessage(data.message, "success");

        taskForm.reset();

        loadTasks();

    } catch (err) {

        console.error(err);
        showMessage(err.message, "error");

    }

}

// ==========================
// LOAD TASKS
// ==========================
async function loadTasks() {

    taskList.innerHTML = `
        <tr>
            <td colspan="4">Loading...</td>
        </tr>
    `;

    try {

        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            throw new Error(data.message || "Unable to load tasks");
        }

        taskList.innerHTML = "";

        if (data.length === 0) {

            taskList.innerHTML = `
                <tr>
                    <td colspan="4">No Tasks Found</td>
                </tr>
            `;

            return;
        }

        data.forEach(task => {

            taskList.innerHTML += `
                <tr>
                    <td>${task.title}</td>
                    <td>${task.id}</td>
                    <td>${task.status}</td>
                    <td>${task.freelancer_id}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

        taskList.innerHTML = `
            <tr>
                <td colspan="4">Failed to load tasks.</td>
            </tr>
        `;

        showMessage(err.message, "error");

    }

}

// ==========================
// EVENTS
// ==========================
taskForm.addEventListener("submit", createTask);

refreshBtn.addEventListener("click", loadTasks);

// ==========================
// INITIAL LOAD
// ==========================
loadTasks();