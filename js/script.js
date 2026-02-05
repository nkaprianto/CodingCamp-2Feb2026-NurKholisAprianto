const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterSelect = document.getElementById('filter-select');
const deleteAllBtn = document.getElementById('delete-all-btn');
const emptyMsg = document.getElementById('empty-msg');
const toastContainer = document.getElementById('toast-container');

// 1. Validasi Tanggal
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// 2. Local Storage
let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

renderTodos();

// --- FUNGSI CUSTOM TOAST (ALERT MENARIK) ---
function showToast(message, icon = "✅") {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> ${message}`;
    
    toastContainer.appendChild(toast);

    // Hapus elemen dari DOM setelah animasi selesai (3 detik)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Form Submit
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (taskInput.value.trim() === "" || dateInput.value === "") {
        showToast("Mohon isi semua bidang!", "⚠️");
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
    showToast("Tugas berhasil ditambahkan!");
});

function saveAndRender() {
    localStorage.setItem('myTodos', JSON.stringify(todos));
    renderTodos(filterSelect.value);
}

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
        tr.setAttribute('data-id', todo.id); 
        tr.innerHTML = `
            <td class="${todo.completed ? 'completed' : ''}">${todo.task}</td>
            <td>${todo.date}</td>
            <td><button class="status-btn" onclick="toggleStatus(${todo.id})">${todo.completed ? 'Done' : 'Pending'}</button></td>
            <td>
                <button style="color:#a2d2ff; background:none; border:none; cursor:pointer; margin-right:10px;" onclick="editTodo(${todo.id})">Edit</button>
                <button style="color:#ffafcc; background:none; border:none; cursor:pointer;" onclick="deleteTodo(${todo.id})">Delete</button>
            </td>
        `;
        todoList.appendChild(tr);
    });
}

// Actions
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

window.saveEdit = (id) => {
    const newTask = document.getElementById(`edit-task-${id}`).value;
    const newDate = document.getElementById(`edit-date-${id}`).value;

    if (newTask.trim() === "" || newDate === "") {
        showToast("Data tidak boleh kosong!", "❌");
        return;
    }

    todos = todos.map(t => t.id === id ? { ...t, task: newTask, date: newDate } : t);
    saveAndRender();
    showToast("Tugas berhasil diperbarui! 📝");
};

window.toggleStatus = (id) => {
    todos = todos.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
};

window.deleteTodo = (id) => {
    if(confirm("Hapus tugas ini?")) {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
        showToast("Tugas telah dihapus!", "🗑️");
    }
};

deleteAllBtn.addEventListener('click', () => {
    if(confirm("Hapus semua tugas?")) {
        todos = [];
        saveAndRender();
        showToast("Semua tugas dibersihkan!", "🧹");
    }
});

filterSelect.addEventListener('change', (e) => renderTodos(e.target.value));