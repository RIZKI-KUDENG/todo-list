let task = {
    todo : [],
    done : []
}

let taskInput = document.getElementById('task-input');
let submitBtn = document.getElementById('submit-btn');

function addTask(){
    submitBtn.addEventListener('click', () => {
        console.log(taskInput.value);
    })
}
addTask();

const days = ['minggu','senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', ];
const date = new Date();
const day = days[date.getDay()];
console.log(day);

// let time = document.getElementById('time');
// time.innerHTML = '<p>Sabtu</p><p>27 September 2055</p>';