
// 1. Get HTML Elements

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const addBtn = document.getElementById("addBtn");



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let editTaskId = null;



function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    
    if (editTaskId !== null) {

        tasks = tasks.map(function(task) {

            if (task.id === editTaskId) {
                task.text = taskText;
            }

            return task;

        });

        editTaskId = null;
        addBtn.textContent = "Add Task";

    }


    else {

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);

    }

    taskInput.value = "";

    saveTasks();
    displayTasks();

}




function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}



function displayTasks() {

    taskList.innerHTML = "";

  
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return task.completed === false;
        }

        if (currentFilter === "completed") {
            return task.completed === true;
        }

        return true;

    });


    
    if (filteredTasks.length === 0) {

        const li = document.createElement("li");

        li.textContent = "No tasks found!";
        li.classList.add("empty-message");

        taskList.appendChild(li);

    }


    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            toggleTask(task.id);

        });


     
        const span = document.createElement("span");

        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }


    
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");

        editButton.addEventListener("click", function() {

            editTask(task.id);

        });


        
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });


  
    updateTaskCount();

}


function updateTaskCount() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    const pending = tasks.filter(function(task) {
        return task.completed === false;
    }).length;

    totalCount.textContent = total;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;

}



function filterTasks(filter) {

    currentFilter = filter;


    const buttons = document.querySelectorAll(".filter-section button");

    buttons.forEach(function(button) {
        button.classList.remove("active-filter");
    });

    const selectedButton = Array.from(buttons).find(function(button) {
        return button.textContent.trim().toLowerCase() ===
            (filter === "active" ? "active" :
             filter === "completed" ? "completed" : "all tasks");
    });

    if (selectedButton) {
        selectedButton.classList.add("active-filter");
    }

    displayTasks();

}



function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });

    if (task) {

        taskInput.value = task.text;

        editTaskId = id;

        addBtn.textContent = "Update Task";

        taskInput.focus();

    }

}



function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks();

    displayTasks();

}


function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });

    saveTasks();

    displayTasks();

}



function clearAllTasks() {

    if (tasks.length === 0) {
        alert("No tasks to clear!");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete all tasks?");

    if (confirmDelete) {

        tasks = [];

        localStorage.removeItem("tasks");

        editTaskId = null;

        taskInput.value = "";

        addBtn.textContent = "Add Task";

        saveTasks();

        displayTasks();

    }

}



displayTasks();

filterTasks("all");


// 13. Add Task Using Enter Key

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});
