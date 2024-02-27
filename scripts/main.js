var editTaskModal = new bootstrap.Modal(
  document.getElementById("editTaskModal")
);

var addTaskModal = new bootstrap.Modal(document.getElementById("addTaskModal"));

var viewTaskModal = new bootstrap.Modal(
  document.getElementById("viewTaskModal")
);

let idCounter = 0;
let parentId;
let taskTitle = document.getElementById("editTaskTitle");
let taskDesc = document.getElementById("editTaskDesc");

function timeGenerator() {
  return `${dayjs()}`;
}

function idGenerator() {
  return `task_${Date.now()}_${idCounter++}`;
}

let tasks = [
  {
    id: "task_100",
    title: "Demo Task 1",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis veniam nihil corporis reprehenderit non quos culpa, error beatae sed facilis quia sapiente, dolorum molestiae laborum laudantium libero unde minima officiis!",
    isCompleted: false,
    time: "Mon, 12 Feb 2024 06:31:02 GMT",
  },
  {
    id: "task_200",
    title: "Demo Task 2",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis veniam nihil corporis reprehenderit non quos culpa, error beatae sed facilis quia sapiente, dolorum molestiae laborum laudantium libero unde minima officiis!",
    isCompleted: false,
    time: "Mon, 12 Feb 2024 06:31:02 GMT",
  },
  {
    id: "task_300",
    title: "Demo Task 3",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis veniam nihil corporis reprehenderit non quos culpa, error beatae sed facilis quia sapiente, dolorum molestiae laborum laudantium libero unde minima officiis!",
    isCompleted: false,
    time: "Mon, 12 Feb 2024 06:31:02 GMT",
  },
  {
    id: "task_400",
    title: "Demo Task 4",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis veniam nihil corporis reprehenderit non quos culpa, error beatae sed facilis quia sapiente, dolorum molestiae laborum laudantium libero unde minima officiis!",
    isCompleted: true,
    time: "Mon, 12 Feb 2024 06:31:02 GMT",
  },
];

// Function to update UI
function updateUI(id, title, isCompleted, time) {
  console.log(tasks);
  const pendingTasks = document.getElementById("pending-task-list");
  const completedTasks = document.getElementById("completed-task-list");

  const taskItem = document.createElement("li");
  taskItem.className = "task-list-items";
  taskItem.setAttribute("id", `${id}`);

  const taskText = document.createElement("span");
  taskText.textContent = title;

  const taskTime = document.createElement("span");
  taskTime.textContent = time;

  const textTimeContainer = document.createElement("div");
  textTimeContainer.appendChild(taskText);
  textTimeContainer.appendChild(taskTime);
  textTimeContainer.addEventListener("click", (e) => {
    parentId = e.target.parentNode.parentNode.id;
    let viewTaskTitle = document.getElementById("viewTaskTitle");
    let viewTaskDesc = document.getElementById("viewTaskDesc");
    tasks.forEach((task)=>{
      if(task.id == parentId){
        console.log("task found")
        console.log(viewTaskTitle)
        console.log(viewTaskDesc)
        viewTaskTitle.innerText = task.title;
        viewTaskDesc.innerText = task.desc;
      }
    })
    viewTaskModal.toggle();
  });

  const completeButton = document.createElement("button");
  if (isCompleted == true) {
    completeButton.innerHTML = "<i class='bi bi-ban'></i>";
  } else {
    completeButton.innerHTML = "<i class='bi bi-check2-circle'></i>";
  }
  completeButton.addEventListener("click", (e) => {
    parentId = e.target.parentNode.parentNode.id;

    tasks.forEach((task) => {
      if (task.id == parentId && task.isCompleted == false) {
        task.isCompleted = true;
        updateUI(task.id, task.title, task.isCompleted, task.time);
        let completedTask = pendingTasks.querySelector(`#${task.id}`);
        pendingTasks.removeChild(completedTask);
      } else if (task.id == parentId && task.isCompleted == true) {
        task.isCompleted = false;
        updateUI(task.id, task.title, task.isCompleted, task.time);
        let pendingTask = completedTasks.querySelector(`#${task.id}`);
        completedTasks.removeChild(pendingTask);
      }
    });
  });

  const editButton = document.createElement("button");
  editButton.innerHTML = "<i class='bi bi-pencil-fill'></i>";
  editButton.addEventListener("click", (e) => {
    parentId = e.target.parentNode.parentNode.id;
    tasks.forEach((task) => {
      if (task.id == parentId) {
        taskTitle.value = task.title;
        taskDesc.value = task.desc;
      }
    });
    editTaskModal.toggle();
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='bi bi-trash-fill'></i>";
  deleteButton.addEventListener("click", (e) => {
    parentId = e.target.parentNode.parentNode.id;
    let taskToDelete;
    tasks.forEach((task) => {
      if (task.id == parentId) {
        taskToDelete = task;
      }
    });
    tasks = tasks.filter((task) => task !== taskToDelete);
    const pendingTasks = document.getElementById("pending-task-list");
    const completedTasks = document.getElementById("completed-task-list");
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";
    tasks.forEach((task) => {
      updateUI(task.id, task.title, task.isCompleted, task.time);
    });
  });

  taskItem.appendChild(textTimeContainer);
  taskItem.appendChild(completeButton);
  taskItem.appendChild(editButton);
  taskItem.appendChild(deleteButton);

  if (isCompleted == false) {
    pendingTasks.appendChild(taskItem);
  } else {
    completedTasks.appendChild(taskItem);
  }
}

// handle edit task modal logic
const editTaskSubmitBtn = document.getElementById("editTaskSubmitBtn");
editTaskSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  tasks.forEach((task) => {
    if (task.id == parentId) {
      task.title = taskTitle.value;
      task.desc = taskDesc.value;
    }
  });
  const pendingTasks = document.getElementById("pending-task-list");
  const completedTasks = document.getElementById("completed-task-list");
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";
  tasks.forEach((task) => {
    updateUI(task.id, task.title, task.isCompleted, task.time);
  });
  taskTitle.value = "";
  taskDesc.value = "";
  editTaskModal.hide();
});

// fetch and display initial tasks on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const pendingTasks = document.getElementById("pending-task-list");
  const completedTasks = document.getElementById("completed-task-list");
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";

  tasks.forEach((task) => {
    updateUI(task.id, task.title, task.isCompleted, task.time);
  });
});

// function to add task to tasks array
function addTask() {
  let id = idGenerator();
  let time = timeGenerator();
  let taskTitle = document.getElementById("addTaskTitle");
  let taskDesc = document.getElementById("addTaskDesc");

  const task = {
    id: id,
    title: taskTitle.value,
    desc: taskDesc.value,
    isCompleted: false,
    time: time,
  };

  tasks.push(task);
  updateUI(task.id, task.title, task.isCompleted, task.time);
  taskTitle.value = "";
  taskDesc.value = "";
  addTaskModal.hide();
}

// add task button event handler
const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskSubmitBtn = document.getElementById("addTaskSubmitBtn");
addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTaskModal.toggle();
});
addTaskSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});
