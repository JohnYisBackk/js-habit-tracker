const inputEl = document.getElementById("inputTracker");
const addBtn = document.getElementById("addBtn");
const habitListEl = document.getElementById("habitList");
const progressTextEl = document.getElementById("progressText");
const newDayBtn = document.getElementById("newDayBtn");
const delAllBtn = document.getElementById("delAllBtn");

// ===============================
//  STATE (DÁTA APLIKÁCIE)
// ===============================
let habits = [];

// ===============================
// LOCAL STORAGE
// ===============================

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// ===============================
// LOCAL STORAGE LOAD
// ===============================

function loadHabits() {
  const storedHabits = localStorage.getItem("habits");

  if (storedHabits) {
    habits = JSON.parse(storedHabits);
  }
}

// ===============================
//  FUNKCIA renderHabits()
// ===============================

function renderHabits() {
  habitListEl.innerHTML = "";

  habits.forEach((habit) => {
    const item = document.createElement("div");
    item.classList.add("habit-item");

    if (habit.done) {
      item.classList.add("habit-done");
    }

    // LEFT
    const left = document.createElement("div");
    left.classList.add("habit-left");

    // CHECKBOX
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.done;

    checkbox.addEventListener("change", () => {
      habit.done = checkbox.checked;
      renderHabits();
      saveHabits();
    });

    // NAME

    const name = document.createElement("span");
    name.classList.add("habit-name");
    name.textContent = habit.name;

    name.addEventListener("dblclick", () => {
      const newName = prompt("Edit habit:", habit.name);
      if (newName === null) return;

      const trimmed = newName.trim();
      if (trimmed === "") return;

      const exists = habits.some(
        (h) =>
          h.id !== habit.id && h.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (exists) {
        alert("This habit already exists.");
        return;
      }

      habit.name = trimmed;
      renderHabits();
      saveHabits();
    });

    left.appendChild(checkbox);
    left.appendChild(name);

    // DELETE

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.textContent = "✖";

    delBtn.addEventListener("click", () => {
      habits = habits.filter((h) => h.id !== habit.id);
      renderHabits();
      saveHabits();
    });

    // POSKLADANIE
    item.appendChild(left);
    item.appendChild(delBtn);
    habitListEl.appendChild(item);
  });

  updateProgress();
}

// ===============================
// DELETE ALL
// ===============================

delAllBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Delete all habits ?");

  if (!confirmDelete) return;

  habits = [];
  renderHabits();
});
// ===============================
//  FUNKCIA updateProgress()
// ===============================

function updateProgress() {
  const doneCount = habits.filter((h) => h.done).length;
  progressTextEl.textContent = `${doneCount}/${habits.length} Done`;
}

// ===============================
//  FUNKCIA addHabit()
// ===============================

function addHabit() {
  const text = inputEl.value.trim();

  if (text === "") {
    alert("Type some of your habits..");
    return;
  }

  habits.push({
    id: Date.now(),
    name: text,
    done: false,
  });

  inputEl.value = "";
  renderHabits();
  saveHabits();
}

// ===============================
//  EVENT LISTENERY
// ===============================

addBtn.addEventListener("click", addHabit);

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addHabit();
});

newDayBtn.addEventListener("click", () => {
  habits = habits.map((h) => ({ ...h, done: false }));
  renderHabits();
  saveHabits();
});

// ===============================
//  INIT
// ===============================

loadHabits();
renderHabits();


