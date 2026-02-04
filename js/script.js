const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterSelect = document.getElementById('filter-select');
const deleteAllBtn = document.getElementById('delete-all-btn');
const emptyMsg = document.getElementById('empty-msg');

// 1. VALIDASI TANGGAL: Cegah pilih tanggal masa lalu
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// 2. LOCAL STORAGE: Ambil data lama jika ada, jika tidak mulai dengan array kosong
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

// Render pertama kali saat halaman dibuka
renderTodos();

// Form Validation and Add Task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (taskInput.value.trim() === "" || dateInput.value === "") {
        alert("Please fill in both fields!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        task: taskInput.value,
        date: dateInput.value,
        completed: false
    };

    todos.push(newTodo);
    saveAndRender(); // Simpan dan tampilkan
    todoForm.reset();
});

// Fungsi pembantu untuk Simpan ke LocalStorage dan Update UI
function saveAndRender() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
    renderTodos(filterSelect.value);
}

// Render List
function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    const filtered = todos.filter(t => {
        if (filter === 'completed') return t.completed;
        if (filter === 'pending') return !t.completed;
        return true;
    });

    if (filtered.length === 0) {
        emptyMsg.classList.remove('hidden');
    } else {
        emptyMsg.classList.add('hidden');
    }

    filtered.forEach(todo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="${todo.completed ? 'completed' : ''}">${todo.task}</td>
            <td>${todo.date}</td>
            <td><button class="status-btn" onclick="toggleStatus(${todo.id})">${todo.completed ? 'Done' : 'Pending'}</button></td>
            <td><button style="color:red; background:none; border:none; cursor:pointer;" onclick="deleteTodo(${todo.id})">Delete</button></td>
        `;
        todoList.appendChild(tr);
    });
}

// Actions
window.toggleStatus = (id) => {
    todos = todos.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
};

window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
};

deleteAllBtn.addEventListener('click', () => {
    if(confirm("Clear all tasks?")) {
        todos = [];
        saveAndRender();
    }
});

filterSelect.addEventListener('change', (e) => renderTodos(e.target.value));