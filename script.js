const addBtn = document.querySelector(".add-task-btn");
const modal = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-btn");
const form = document.querySelector("#taskForm")
const taskContainer = document.querySelector(".task-list")
const searchTask = document.querySelector("#searchTask")
const filterCategory = document.querySelector("#filterCategory")
const filterStatus = document.querySelector("#filterStatus")
const filterPriority = document.querySelector("#filterPriority")
const clearAllBtn = document.querySelector(".clear-btn")
const resetBtn = document.querySelector(".reset-btn")
const confirmModal = document.querySelector(".confirm-modal")
const themeBtn = document.querySelector(".theme-btn")
const icon = themeBtn.querySelector("i");



addBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
        confirmModal.classList.remove("active");
    }
});


// theme switch handler
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")

    if (document.body.classList.contains("dark-theme")) {
        icon.classList.remove("ri-moon-fill");
        icon.classList.add("ri-sun-line");
    } else {
        icon.classList.remove("ri-sun-line");
        icon.classList.add("ri-moon-fill");
    }
})


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let updateIndex = null;


// function for show tasks
const taskShow = (tasks) => {

    taskContainer.innerHTML = ""

    tasks.forEach(task => {

        const icon = task.status === "completed" ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line";

        const completedClass = task.status === "completed" ? "completed" : "";

        taskContainer.innerHTML += ` <div class="task-card  ${completedClass}" data-id="${task.id}" data-status="${task.status}" data-category="${task.category}">

                    <div class="card-top">
                        <span class="badge ${task.category.toLowerCase}">
                            ${task.category}
                        </span>
                        <span class="priority ${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>
                    </div>
                    <h3>${task.title}</h3>
                    <p>
                        ${task.description}
                    </p>
                    <div class="card-bottom">
                        <small>
                        <i class="ri-calendar-line"></i>
                         ${task.dueDate}
                        </small>

                        <div class="actions">
                            <button onclick="completeTask(${task.id})" class="complete-btn">
                            <i class="${icon}"></i>
                            </button>
                            <button onClick="updateTask(${task.id})">
                            <i class="ri-pencil-line"></i>
                            </button>
                            <button onClick=deleteTask(${task.id})>
                            <i class="ri-delete-bin-line"></i>     
                            </button>
                        </div>

                    </div>

                </div>`
    });
}
taskShow(tasks)


// function for calculate totalTasks
const totalTasks = (tasks) => {
    let count = 0
    for (let i = 0; i < tasks.length; i++) {
        count++
    }

    document.querySelector("#totalTask").textContent = count

}
totalTasks(tasks)


// function for calculate remainingTasks 
const remainingTasks = (tasks) => {
    let count = 0
    const filteredTasks = tasks.filter(task => task.status === "pending")
    for (let i = 0; i < filteredTasks.length; i++) {
        count++
    }

    document.querySelector("#remainingTask").textContent = count
}
remainingTasks(tasks)


// function for calculate completedTasks
const completedTasks = (tasks) => {
    let count = 0
    const filteredTasks = tasks.filter(task => task.status === "completed")
    for (let i = 0; i < filteredTasks.length; i++) {
        count++
    }

    document.querySelector("#completedTask").textContent = count
}
completedTasks(tasks)


// form handler
form.addEventListener("submit", (e) => {
    e.preventDefault()

    const title = e.target[0].value
    const description = e.target[1].value
    const category = e.target[2].value
    const priority = e.target[3].value
    const dueDate = e.target[4].value

    if (title.trim() === "" || description.trim() === "" || category.trim() === "" || priority.trim() === "" || dueDate.trim() === "") {
        alert("all fields are required!")
        return
    }

    let newTask = {
        id: Date.now(),
        title,
        description,
        category,
        priority,
        dueDate,
        status: "pending"
    }

    if (updateIndex !== null) {
        const index = tasks.findIndex(task => task.id === updateIndex);

        newTask.id = updateIndex;
        newTask.status = tasks[index].status

        tasks[index] = newTask
        updateIndex = null

    } else {

        tasks.push(newTask);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks))
    totalTasks(tasks)
    remainingTasks(tasks)
    completedTasks(tasks)
    taskShow(tasks);

    form.reset();
    modal.classList.remove("active");
})


// function for delete Task
const deleteTask = (id) => {

    tasks = tasks.filter(task => task.id !== id);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    taskShow(tasks)
    totalTasks(tasks)
    remainingTasks(tasks)
    completedTasks(tasks)
};


// function for update Task
const updateTask = (id) => {
    updateIndex = id;

    const task = tasks.find(task => task.id === id);

    form.title.value = task.title;
    form.description.value = task.description;
    form.category.value = task.category;
    form.priority.value = task.priority;
    form.dueDate.value = task.dueDate;

    modal.classList.add("active");
}


// function for complete Task
const completeTask = (id) => {
    const task = tasks.find(task => task.id === id);

    task.status = task.status === "completed" ? "pending" : "completed";

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    taskShow(tasks);
    completedTasks(tasks);
    remainingTasks(tasks);
};


// searchTask handler
searchTask.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase()

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(value) ||
        task.description.toLowerCase().includes(value)
    );

    taskShow(filteredTasks)
})


// filter category handler
filterCategory.addEventListener("change", (event) => {

    if (event.target.value) {

        const filteredTasks = tasks.filter(task => task.category.toLowerCase().includes(event.target.value))
        taskShow(filteredTasks)
    }

})


// filter status handler
filterStatus.addEventListener("change", (event) => {

    if (event.target.value) {
        const filteredTasks = tasks.filter(task =>
            task.status.toLowerCase().includes(event.target.value)
        )
        taskShow(filteredTasks)
    }
})


// filter priority handler
filterPriority.addEventListener("change", (event) => {

    if (event.target.value) {

        const filteredTasks = tasks.filter(task => task.priority.toLowerCase().includes(event.target.value))
        taskShow(filteredTasks)
    }
})


// rest btn handler
resetBtn.addEventListener("click", () => {
    searchTask.value = "";
    filterCategory.value = "";
    filterStatus.value = "";
    filterPriority.value = "";

    taskShow(tasks);
});

// clear allbtn handler
clearAllBtn.addEventListener("click", () => {
    confirmModal.classList.add("active");
})

document.querySelector(".delete-btn")
    .addEventListener("click", () => {
        localStorage.removeItem("tasks");
        tasks = [];

        taskShow(tasks);
        completedTasks(tasks);
        totalTasks(tasks)
        remainingTasks(tasks);

        confirmModal.classList.remove("active");
    });

document.querySelector(".cancel-btn")
    .addEventListener("click", () => {
        confirmModal.classList.remove("active");
    });