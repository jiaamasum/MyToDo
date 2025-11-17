// Minimal modal handling: open on edit buttons, update text on save, close on cancel/escape.

const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-text");
const editSaveBtn = document.getElementById("edit-save");
const editCancelBtn = document.getElementById("edit-cancel");
const editCloseBtn = document.getElementById("edit-close");
const editForm = document.getElementById("edit-form");
const tasksList = document.getElementById("tasks-list");
const completedList = document.getElementById("completed-list");

let editingCard = null;

function openEditModal(card) {
  editingCard = card;
  const textNode = card.querySelector(".task-text");
  editInput.value = textNode ? textNode.textContent : "";
  editModal.classList.add("is-open");
  editInput.focus();
  editInput.select();
}

function closeEditModal() {
  editingCard = null;
  editModal.classList.remove("is-open");
}

function saveEdit() {
  if (!editingCard) return;
  const updated = editInput.value.trim();
  if (!updated) {
    editInput.focus();
    return;
  }
  const textNode = editingCard.querySelector(".task-text");
  if (textNode) {
    textNode.textContent = updated;
  }
  closeEditModal();
}

function attachEditListener(listEl) {
  if (!listEl) return;
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="edit"]');
    if (!btn) return;
    const card = btn.closest(".task-card");
    if (!card) return;
    openEditModal(card);
  });
}

attachEditListener(tasksList);
attachEditListener(completedList);

editSaveBtn?.addEventListener("click", saveEdit);
editCancelBtn?.addEventListener("click", closeEditModal);
editCloseBtn?.addEventListener("click", closeEditModal);
editForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  saveEdit();
});

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
