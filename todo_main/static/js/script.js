// Simple in-memory store (kept client-side and not persisted)
let tasks = [{ id: 1, text: "This is one task", completed: false }];
let completedTasks = [
  { id: 2, text: "This is a completed task.", completed: true },
];

const tasksList = document.getElementById("tasks-list");
const completedList = document.getElementById("completed-list");
const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const todayDateEl = document.getElementById("today-date");
const openCountEl = document.getElementById("open-count");
const doneCountEl = document.getElementById("done-count");
const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-text");
const editSaveBtn = document.getElementById("edit-save");
const editCancelBtn = document.getElementById("edit-cancel");
const editCloseBtn = document.getElementById("edit-close");

let editingTaskId = null;

function renderLists() {
  tasksList.innerHTML = "";
  completedList.innerHTML = "";

  if (!tasks.length) {
    tasksList.innerHTML =
      '<p class="list-empty">No tasks yet. Add your first one below.</p>';
  } else {
    tasks.forEach((task) => {
      const card = createTaskCard(task, false);
      tasksList.appendChild(card);
    });
  }

  if (!completedTasks.length) {
    completedList.innerHTML =
      '<p class="list-empty">Finished items will show up here.</p>';
  } else {
    completedTasks.forEach((task) => {
      const card = createTaskCard(task, true);
      completedList.appendChild(card);
    });
  }

  openCountEl.textContent = tasks.length;
  doneCountEl.textContent = completedTasks.length;
}

function createTaskCard(task, isCompleted) {
  const card = document.createElement("div");
  card.className = "task-card" + (isCompleted ? " completed" : "");
  card.dataset.id = task.id;

  const textSpan = document.createElement("div");
  textSpan.className = "task-text";
  textSpan.textContent = task.text;

  card.appendChild(textSpan);

  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";

  if (!isCompleted) {
    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn-success";
    doneBtn.innerHTML = '<span class="icon">&#10003;</span>Mark as done';
    doneBtn.addEventListener("click", () => markAsDone(task.id));
    btnGroup.appendChild(doneBtn);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.innerHTML = '<span class="icon">&times;</span>';
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", () => deleteTask(task.id, isCompleted));
  btnGroup.appendChild(deleteBtn);

  if (!isCompleted) {
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-outline";
    editBtn.innerHTML = '<span class="icon">&#9998;</span>Edit';
    editBtn.title = "Edit";
    editBtn.addEventListener("click", () => editTask(task.id));
    btnGroup.appendChild(editBtn);
  }

  card.appendChild(btnGroup);
  return card;
}

// --- Actions ---

function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };
  tasks.push(newTask);
  newTaskInput.value = "";
  renderLists();
}

function markAsDone(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;

  const [task] = tasks.splice(index, 1);
  task.completed = true;
  completedTasks.unshift(task);
  renderLists();
}

function deleteTask(id, isCompleted) {
  if (isCompleted) {
    completedTasks = completedTasks.filter((t) => t.id !== id);
  } else {
    tasks = tasks.filter((t) => t.id !== id);
  }
  renderLists();
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  openEditModal(task);
}

function openEditModal(task) {
  editingTaskId = task.id;
  editInput.value = task.text;
  editModal.classList.add("is-open");
  editInput.focus();
  editInput.select();
}

function closeEditModal() {
  editingTaskId = null;
  editModal.classList.remove("is-open");
}

function saveEdit() {
  if (!editingTaskId) return;
  const updated = editInput.value.trim();
  if (!updated) {
    editInput.focus();
    return;
  }
  const task = tasks.find((t) => t.id === editingTaskId);
  if (task) {
    task.text = updated;
    renderLists();
  }
  closeEditModal();
}

// --- Event listeners ---

addTaskBtn.addEventListener("click", addTask);

newTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addTask();
  }
});

// Initialize UI
renderLists();

// Modal events
editSaveBtn.addEventListener("click", saveEdit);
editCancelBtn.addEventListener("click", closeEditModal);
editCloseBtn.addEventListener("click", closeEditModal);

editInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    saveEdit();
  }
  if (e.key === "Escape") {
    e.preventDefault();
    closeEditModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editModal.classList.contains("is-open")) {
    closeEditModal();
  }
});
