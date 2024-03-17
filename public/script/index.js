"use strict";

let divMenu = null;
let divContent = null;
let userID;

document.addEventListener("DOMContentLoaded", (e) => {
    divMenu = document.getElementById("divMenu");
    divContent = document.getElementById("divContent");

    userID = parseInt(localStorage.getItem("userID"));
    if (userID) {
        showToDoList(); // Viser to-do lista når brukaren er logget inn
    } else {
        showLogin();
    }
});

function showCreateUser() {
    loadTemplate("menu_1", divMenu, true);
    loadTemplate("createUser", divContent, true);
    const createUserButton = document.getElementById("createUserButton");

    createUserButton.onclick = async function (e) {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("pswHash").value;
        sha256(password, async (pswHash) => {
            const user = { name, email, pswHash };
            const response = await postTo("/user", user);
            if (response.ok) {
                showToDoList(); 
            }
        });
    };
}

function showLogin() {
    loadTemplate("loginUser", divContent, true);

    const loginButton = document.getElementById("loginButton");
    loginButton.onclick = async function (e) {
        const email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPswHash").value;
        sha256(password, async (pswHash) => {
            let user = { email, pswHash };
            console.log(user);
            const resp = await postTo("/user/login", user);
            if (resp.ok) {
                const shema = await resp.json();
                console.log(shema);
                userID = shema.data.id;
                localStorage.setItem("userID", userID);
                location.reload();
            }
        });
    };
}

function showToDoList() {
    loadTemplate("menu_1", divMenu, true);
    loadTemplate("todoList", divContent, true);

    const addTodoButton = document.getElementById("addTodoButton");
    addTodoButton.addEventListener("click", addTodo);

    loadExistingTodos(); // Last inn eksisterende oppgaver fra localStorage
}

function loadExistingTodos() {
    const todoItemsList = document.getElementById("todoItems");
    todoItemsList.innerHTML = "";

    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    
    todos.forEach(todo => {
        const li = createTodoItem(todo);
        todoItemsList.appendChild(li);
    });
}

function createTodoItem(todo) {
    const li = document.createElement("li");
    
    // Legg til oppgavetekst
    const todoText = document.createElement("span");
    todoText.textContent = todo;
    li.appendChild(todoText);

    // Legg til sletteknapp
    const deleteButton = createDeleteButton(todo);
    li.appendChild(deleteButton);

    return li;
}

function createDeleteButton(todo) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Fjern";
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todo);
        loadExistingTodos(); // Oppdater listen etter sletting
    });
    return deleteButton;
}

function deleteTodoItem(todo) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const updatedTodos = [];

    for (let i = 0; i < todos.length; i++) {
        if (todos[i] !== todo) {
            updatedTodos.push(todos[i]);
        }
    }

    localStorage.setItem("todos", JSON.stringify(updatedTodos));
}


function addTodo() {
    const todoItemInput = document.getElementById("todoItem");
    const todoItem = todoItemInput.value.replace();

    if (todoItem !== "") {
        const todoItemsList = document.getElementById("todoItems");
        const li = createTodoItem(todoItem);
        todoItemsList.appendChild(li);

        saveTodoToLocalstorage(todoItem);

        todoItemInput.value = "";
    }
}

function saveTodoToLocalstorage(todo) {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

async function postTo(url, data) {
    const header = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const respon = await fetch(url, header);
    return respon;
}

function logout(){
    localStorage.clear();
    location.reload();
}
