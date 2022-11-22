const addButton = document.querySelector("#add-button");
const todoInput = document.querySelector("#todo-input");
const deleteButton = document.querySelector("#delete-button");
const todoList = document.querySelector("#todo-list");

const allCheckbox = document.querySelector("#all");
const openCheckbox = document.querySelector("#open");
const doneCheckbox = document.querySelector("#done");

let todos = [];

// Lädt die daten aus dem API

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
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

    // updatet die todos im backend

    if (todo.done === true) {
      checkBox.checked = true;
    }

    checkBox.addEventListener("change", (event) => {
      todo.done = event.target.checked;
      //console.log(todo.done);
      console.log(todo);
      let updateTodo = todo;
      let id = todo.id;

      fetch("http://localhost:4730/todos/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateTodo),
      })
        .then((res) => res.json())
        .then(() => {});
    });
  });
}

// fügt ein neues Todo hinzu

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

// löscht die erledigten todos

// function deleteBtn(e) {
//   for (let li of todoList.children) {
//     console.log(getId);
//     console.log(todoList.children);
//     if (li.querySelector("input").checked === true) {
//       console.log(li.querySelector("input").checked);

//       let getId = todo.id;
//       // console.log(li);
//       fetch("http://localhost:4730/todos/" + getId, {
//         method: "DELETE",
//       })
//         .then((res) => res.json())
//         .then(() => {});
//     }
//   }
//   renderTodos();
// }

// deleteButton.addEventListener("change", (event) => {
//   todo.id = event.target.checked;
//   //console.log(todo.done);
//   console.log(todo);
//   let updateTodo = todo;
//   let id = todo.id;

//   fetch("http://localhost:4730/todos/" + id, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updateTodo),
//   })
//     .then((res) => res.json())
//     .then(() => {});
// });

function deleteBtn() {
  //alle todos die Done sind sollen gelöscht werden
  //auf die todos zugreifen und dann herausfinden ob sie Done sind oder nicht

  const todosWithDone = [];

  todos.forEach((todo) => {
    if (todo.done === true) {
      todosWithDone.push(todo);
    }
  });

  const deletePromises = [];

  for (let todo of todosWithDone) {
    deletePromises.push(
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  }

  Promise.all(deletePromises).then(() => {
    loadTodos();
  });
}

deleteButton.addEventListener("click", deleteBtn);

// filtert die Optionen

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
