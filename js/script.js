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

// 2. LOCAL STORAGE: Ambil data lama
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

renderTodos();

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
    saveAndRender();
    todoForm.reset();
});

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
        // Menambahkan data-id agar baris mudah ditemukan saat mode edit
        tr.setAttribute('data-id', todo.id); 
        
        tr.innerHTML = `
            <td class="${todo.completed ? 'completed' : ''}">${todo.task}</td>
            <td>${todo.date}</td>
            <td>
                <button class="status-btn" onclick="toggleStatus(${todo.id})">
                    ${todo.completed ? 'Done' : 'Pending'}
                </button>
            </td>
            <td>
                <button style="color:var(--primary-pastel, #7d85f5); background:none; border:none; cursor:pointer; margin-right:10px;" onclick="editTodo(${todo.id})">Edit</button>
                <button style="color:red; background:none; border:none; cursor:pointer;" onclick="deleteTodo(${todo.id})">Delete</button>
            </td>
        `;
        todoList.appendChild(tr);
    });
}

// --- ACTIONS ---

// Fungsi untuk masuk ke mode Edit
window.editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    const tr = document.querySelector(`tr[data-id="${id}"]`);
    
    if (todo && tr) {
        tr.innerHTML = `
            <td><input type="text" id="edit-task-${id}" value="${todo.task}" class="edit-input"></td>
            <td><input type="date" id="edit-date-${id}" value="${todo.date}" class="edit-input" min="${today}"></td>
            <td><button class="status-btn" onclick="saveEdit(${id})">Save</button></td>
            <td><button style="color:gray; background:none; border:none; cursor:pointer;" onclick="renderTodos()">Cancel</button></td>
        `;
    }
};

// Fungsi untuk menyimpan hasil edit
window.saveEdit = (id) => {
    const newTask = document.getElementById(`edit-task-${id}`).value;
    const newDate = document.getElementById(`edit-date-${id}`).value;

    if (newTask.trim() === "" || newDate === "") {
        alert("Fields cannot be empty!");
        return;
    }

    todos = todos.map(t => t.id === id ? { ...t, task: newTask, date: newDate } : t);
    saveAndRender();
};

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