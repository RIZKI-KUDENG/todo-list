let tasks = {
  todo: [],
  done: [],
};

let taskInput = document.getElementById("task-input");
let submitBtn = document.getElementById("submit-btn");
// menambah tugas
function addTask() {
  submitBtn.addEventListener("click", () => {
    let taskText = taskInput.value.trim();  // mengambil input user 
    if (taskText === "") {
         alert("Tidak boleh kosong");
         return;
    }
    const priorityBtn = document.querySelector(".priority-btn.active");
    const priority = priorityBtn ? priorityBtn.dataset.priority : "medium"; // menentukan prioritas
    let task = {
      id: Date.now(),
      text: taskText,
      priority: priority,
      date: new Date().toLocaleString("id-ID"), // bungkus kedalam objek
      completed: false,
    };
    tasks.todo.push(task); //push ke dalam local storage
    saveTasks();
  });
}
addTask();

function showTime() {
  const now = new Date();
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];
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
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  const time = document.getElementById("time");
  time.innerHTML = `<p>${dayName},</p><p>${date} ${monthName} ${year}</p>`;
}
showTime();
// save & load task dari local storage

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// inisialisasi prioritas tugas

function initializePriorityButtons() {
  const priorityBtns = document.querySelectorAll(".priority-btn");
  priorityBtns.forEach((btn) => {
    btn.addEventListener("click",  () => {
    priorityBtns.forEach( b => {
        b.classList.remove("active");
        btn.classList.add("active");
    })
    });
  });
  document.querySelector(".priority-btn.medium").classList.add("active");
}

initializePriorityButtons();
