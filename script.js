// Data storage
let tasks = {
  todo: [],
  done: [],
};
document.addEventListener("DOMContentLoaded", function () {
  // Load dari localStorage
  loadTasks();

  // Update time
  updateTime();
  setInterval(updateTime, 60000);

  // Initialize priority buttons
  initializePriorityButtons();

  // Render tasks
  renderTasks();
});

function updateTime() {
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  let time = document.getElementById("time");
  time.innerHTML = `<p>${day},</p><p>${date} ${month} ${year}</p>`;
}
updateTime();

function initializePriorityButtons() {
  const priorityBtns = document.querySelectorAll(".priority-btn");
  priorityBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      priorityBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  // set default priority
  document.querySelector(".priority-btn.medium").classList.add("active");
}
initializePriorityButtons();
function addTask() {
  taskInput = document.getElementById("task-input");
  taskText = taskInput.value.trim();
  if (taskText === "") {
    //Ambil dan validasi input
    alert("Tugas tidak boleh kosong");
    return;
  }
  const priorityBtn = document.querySelector(".priority-btn.active");
  const priority = priorityBtn ? priorityBtn.dataset.priority : "medium"; // menentukan prioritas / default medium
  let task = {
    id: Date.now(),
    text: taskText,
    priority: priority,
    date: new Date().toLocaleString("id-ID"), // bungkus ke dalam objek
    completed: false,
  };
  tasks.todo.push(task);
  saveTasks();
  renderTasks();

  // memberi feedback & reset kolom input
  taskInput.value = "";
  taskInput.style.borderColor = "#28a745";
  setTimeout(() => {
    taskInput.style.borderColor = "#dee2e6";
  }, 1000);
}

function toggleTask(id) {
  const todoIndex = tasks.todo.findIndex((t) => t.id === id);
  const doneIndex = tasks.done.findIndex((t) => t.id === id); //mencari lokasi tasks
  if (todoIndex !== -1) {
    const task = tasks.todo.splice(todoIndex, 1)[0];
    task.completed = true; //mengubah status
    tasks.done.push(task);
  } else if (doneIndex !== -1) {
    const task = tasks.done.splice(doneIndex, 1)[0];
    task.completed = false; //mengubah status
    tasks.todo.push(task);
  }
  saveTasks();
  renderTasks();
}
//hapus satu tasks
function deleteTask(id, type) {
  if (confirm("Apakah anda yakin ingin menghapus tugas ini?")) {
    tasks[type] = tasks[type].filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }
}
//hapus semua
function deleteAllTasks(type) {
  if (
    confirm(
      `Apakah anda yakin ingin menghapus semua tugas di ${
        type === "todo" ? "To Do" : "Done"
      } `
    )
  ) {
    tasks[type] = [];
    saveTasks();
    renderTasks();
  }
}
//switch tab
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update tab content
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });

  if (tab === "todo") {
    document.getElementById("todoTab").classList.add("active");
  } else {
    document.getElementById("doneTab").classList.add("active");
  }
}
// Render Tasks
function renderTasks() {
  renderTodoTasks();
  renderDoneTasks();
  updateCounts();
}
function renderTodoTasks() {
  const todoList = document.getElementById("todoList");
  const deleteTodoBtn = document.getElementById("deleteTodoBtn");

  if (tasks.todo.length === 0) {
    todoList.innerHTML = `
                    <div class="empty-state" style="margin-top: 20px; text-align: center;">
                        <p>Belum ada tugas</p>
                        <p style="font-size: 12px; margin-top: 10px;">Tambahkan tugas baru untuk memulai</p>
                    </div>
                `;
    deleteTodoBtn.style.display = "none";
  } else {
    todoList.innerHTML = tasks.todo
      .map(
        (task) => `
                    <div class="task-item">
                        <input 
                            type="checkbox" 
                            class="task-checkbox" 
                            onchange="toggleTask(${task.id})"
                        >
                        <div class="task-content">
                            <div class="task-text">${escapeHtml(
                              task.text
                            )}</div>
                            <div>
                                <span class="task-priority priority-${
                                  task.priority
                                }">
                                    ${task.priority.toUpperCase()}
                                </span>
                                <span class="task-date">${task.date}</span>
                            </div>
                        </div>
                        <button class="delete-task-btn" onclick="deleteTask(${
                          task.id
                        }, 'todo')">
                            Hapus
                        </button>
                    </div>
                `
      )
      .join("");
    deleteTodoBtn.style.display = "block";
  }
}
renderTodoTasks();
function renderDoneTasks() {
  const doneList = document.getElementById("doneList");
  const deleteDoneBtn = document.getElementById("deleteDoneBtn");

  if (tasks.done.length === 0) {
    doneList.innerHTML = `
                    <div class="empty-state" style="margin-top: 20px; text-align: center;">
                        <p>Belum ada tugas selesai</p>
                        <p style="font-size: 12px; margin-top: 10px;">Selesaikan tugas untuk melihatnya di sini</p>
                    </div>
                `;
    deleteDoneBtn.style.display = "none";
  } else {
    doneList.innerHTML = tasks.done
      .map(
        (task) => `
                    <div class="task-item done-task">
                        <input 
                            type="checkbox" 
                            class="task-checkbox" 
                            checked
                            onchange="toggleTask(${task.id})"
                        >
                        <div class="task-content">
                            <div class="task-text">${escapeHtml(
                              task.text
                            )}</div>
                            <div>
                                <span class="task-priority priority-${
                                  task.priority
                                }">
                                    ${task.priority.toUpperCase()}
                                </span>
                                <span class="task-date">${task.date}</span>
                            </div>
                        </div>
                        <button class="delete-task-btn" onclick="deleteTask(${
                          task.id
                        }, 'done')">
                            Hapus
                        </button>
                    </div>
                `
      )
      .join("");
    deleteDoneBtn.style.display = "block";
  }
}

// Update Counts
function updateCounts() {
  document.getElementById("todoCount").textContent = tasks.todo.length;
  document.getElementById("doneCount").textContent = tasks.done.length;
}

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from LocalStorage
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Allow Enter key to submit (Ctrl/Cmd + Enter)
document.getElementById("taskInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    addTask();
  }
});
