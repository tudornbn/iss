// URL of the backend server
const BASE_URL = "http://localhost:3000";

let loggedInEmployeeId = null;

// Handle employee log in
if (document.getElementById("login-form")) {
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const employeeId = document.getElementById("employeeId").value;

      fetch(`${BASE_URL}/employees/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: employeeId }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(`Logged in as ${data.name}`);
          loggedInEmployeeId = data.id;
          document.getElementById("login-form").style.display = "none";
          document.getElementById("logout-button").style.display = "block";
          fetchTasks();
        });
    });
}

// Handle employee log out
if (document.getElementById("logout-button")) {
  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      fetch(`${BASE_URL}/employees/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: loggedInEmployeeId }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(`Logged out`);
          loggedInEmployeeId = null;
          document.getElementById("login-form").style.display = "block";
          document.getElementById("logout-button").style.display = "none";
          document.getElementById("task-list").innerHTML = "";
        });
    });
}

// Fetch and display the list of tasks for the logged-in employee
function fetchTasks() {
  if (document.getElementById("task-list")) {
    fetch(`${BASE_URL}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Clear previous tasks
        data
          .filter((task) => task.employeeId === loggedInEmployeeId)
          .forEach((task) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Task: ${task.description}`;
            taskList.appendChild(listItem);
          });
      });
  }
}

// Fetch and display the list of employees (manager dashboard)
if (document.getElementById("employee-list")) {
  fetch(`${BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      const employeeList = document.getElementById("employee-list");
      data.forEach((employee) => {
        const listItem = document.createElement("li");
        listItem.textContent = `ID: ${employee.id}, Name: ${
          employee.name
        }, Logged in at: ${new Date(employee.loggedInAt).toLocaleTimeString()}`;
        employeeList.appendChild(listItem);
      });
    });
}

// Handle task assignment form submission (manager dashboard)
if (document.getElementById("task-form")) {
  document
    .getElementById("task-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const employeeId = document.getElementById("employeeId").value;
      const description = document.getElementById("description").value;

      fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, description }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(`Task assigned: ${data.description}`);
        });
    });
}
