const addButton = document.querySelector("#add-button");
const todoInput = document.querySelector("#todo-input");
const deleteButton = document.querySelector("#delete-button");
const todoList = document.querySelector("#todo-list");

const allCheckbox = document.querySelector("#all");
const openCheckbox = document.querySelector("#open");
const doneCheckbox = document.querySelector("#done");

let todos = [];
// Ladet die daten aus dem API
function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      console.log(todosFromApi);
      todos = todosFromApi;
      renderTodos();
    });
}
// setzt die Daten auf "" und erzeugt ein neues Element
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const newLi = document.createElement("li");
    const label = document.createElement("label");
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    newLi.append(checkBox, label);

    const text = document.createTextNode(todo.description);
    newLi.appendChild(text);
    todoList.appendChild(newLi);
  });
}

addButton.addEventListener("click", () => {
  const newTodoText = todoInput.value;
  if (newTodoText.length < 5) {
    return;
  }
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi);
      renderTodos();
    });
});

function filterTodos(status = "open") {
  for (let li of todoList.children) {
    let condition = li.querySelector("input").checked;

    if (status === "done") {
      condition = !condition;
    }

    if (condition) {
      li.hidden = true;
    } else {
      li.hidden = false;
    }

    fetch("http://localhost:4730/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(condition),
    })
      .then((res) => res.json())
      .then((newTodoFromApi) => {
        todos.push(newTodoFromApi);
        renderTodos();
      });
  }
}

function removeFilter() {
  for (let li of todoList.children) {
    li.hidden = false;
  }
}

allCheckbox.addEventListener("change", removeFilter);

openCheckbox.addEventListener("change", () => filterTodos("open"));

doneCheckbox.addEventListener("change", () => filterTodos("done"));

loadTodos();
