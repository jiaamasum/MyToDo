const tasksList = document.getElementById("tasks-list");
const completedList = document.getElementById("completed-list");
const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const newTaskForm = document.getElementById("new-task-form");
const openCountEl = document.getElementById("open-count");
const doneCountEl = document.getElementById("done-count");

const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-text");
const editSaveBtn = document.getElementById("edit-save");
const editCancelBtn = document.getElementById("edit-cancel");
const editCloseBtn = document.getElementById("edit-close");

let editingCard = null;

function showToast(message) {
  let holder = document.getElementById("toast-holder");
  if (!holder) {
    holder = document.createElement("div");
    holder.id = "toast-holder";
    holder.style.position = "fixed";
    holder.style.bottom = "18px";
    holder.style.left = "50%";
    holder.style.transform = "translateX(-50%)";
    holder.style.zIndex = "50";
    holder.style.display = "grid";
    holder.style.gap = "8px";
    document.body.appendChild(holder);
  }

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.padding = "10px 14px";
  toast.style.borderRadius = "10px";
  toast.style.background = "rgba(15,23,42,0.9)";
  toast.style.color = "#e2e8f0";
  toast.style.boxShadow = "0 10px 24px rgba(0,0,0,0.35)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.12s ease";

  holder.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener(
      "transitionend",
      () => toast.remove(),
      { once: true }
    );
  }, 1600);
}

function updateCounts() {
  openCountEl.textContent = tasksList.querySelectorAll(".task-card").length;
  doneCountEl.textContent = completedList.querySelectorAll(".task-card").length;
}

function createTaskCard(text) {
  const card = document.createElement("div");
  card.className = "task-card";

  const textSpan = document.createElement("div");
  textSpan.className = "task-text";
  textSpan.textContent = text;

  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";

  const doneBtn = document.createElement("button");
  doneBtn.className = "btn btn-success";
  doneBtn.dataset.action = "done";
  doneBtn.innerHTML = '<span class="icon">&#10003;</span>Mark as done';

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.dataset.action = "delete";
  deleteBtn.innerHTML = '<span class="icon">&times;</span>';
  deleteBtn.title = "Delete";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-outline";
  editBtn.dataset.action = "edit";
  editBtn.innerHTML = '<span class="icon">&#9998;</span>Edit';
  editBtn.title = "Edit";

  btnGroup.append(doneBtn, deleteBtn, editBtn);
  card.append(textSpan, btnGroup);
  return card;
}

function handleTaskAction(e) {
  const actionBtn = e.target.closest("[data-action]");
  if (!actionBtn) return;

  const card = actionBtn.closest(".task-card");
  if (!card) return;

  const action = actionBtn.dataset.action;

  if (action === "done") {
    card.classList.add("completed");
    tasksList.removeChild(card);
    // Clone without the "done" button for completed list.
    const clone = card.cloneNode(true);
    clone.querySelector('[data-action="done"]')?.remove();
    completedList.prepend(clone);
    showToast("Task completed");
  }

  if (action === "delete") {
    card.remove();
    showToast("Task deleted");
  }

  if (action === "edit") {
    editingCard = card;
    editInput.value = card.querySelector(".task-text")?.textContent || "";
    editModal.classList.add("is-open");
    editInput.focus();
    editInput.select();
  }

  updateCounts();
}

function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;

  const card = createTaskCard(text);
  tasksList.prepend(card);
  newTaskInput.value = "";
  showToast("Task added");
  updateCounts();
}

function saveEdit() {
  if (!editingCard) return;
  const updated = editInput.value.trim();
  if (!updated) {
    editInput.focus();
    return;
  }
  const textNode = editingCard.querySelector(".task-text");
  if (textNode) textNode.textContent = updated;
  closeEditModal();
  showToast("Task updated");
}

function closeEditModal() {
  editModal.classList.remove("is-open");
  editingCard = null;
}

// Event bindings
newTaskForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

tasksList?.addEventListener("click", handleTaskAction);
completedList?.addEventListener("click", handleTaskAction);

editSaveBtn?.addEventListener("click", saveEdit);
editCancelBtn?.addEventListener("click", closeEditModal);
editCloseBtn?.addEventListener("click", closeEditModal);

editInput?.addEventListener("keydown", (e) => {
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

// Counts on load
updateCounts();
