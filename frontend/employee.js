// URL of the backend server
const BASE_URL = "http://localhost:3000";
let loginTime = null;

// Handle employee login
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const employeeId = document.getElementById("loginEmployeeId").value;

    fetch(`${BASE_URL}/employees/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: employeeId }),
    })
      .then((response) => response.json())
      .then((employee) => {
        loginTime = new Date(employee.loggedInAt);
        displayEmployeeDetails(employee);
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Login failed. Please check the employee ID and try again.");
      });
  });

// Fetch and display employee details and tasks
function displayEmployeeDetails(employee) {
  document.getElementById("employee-info").innerHTML = `
    <strong>ID:</strong> ${employee.id}<br>
    <strong>Name:</strong> ${employee.name}<br>
    <strong>Manager:</strong> ${employee.manager}<br>
    <strong>Active:</strong> ${employee.active}<br>
  `;

  fetch(`${BASE_URL}/employees/${employee.id}`)
    .then((response) => response.json())
    .then((data) => {
      const employeeTasks = data.tasks;
      const taskList = document.getElementById("employee-tasks");
      taskList.innerHTML = ""; // Clear previous tasks
      employeeTasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>Title:</strong> ${task.title}<br>
          <strong>Description:</strong> ${task.description}<br>
          <strong>Deadline:</strong> ${task.deadline}<br>
          <strong>Status:</strong> ${task.status}<br>
          <button onclick="markTaskAsCompleted(${task.id})">Mark as Completed</button>
        `;
        taskList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      alert("Failed to fetch tasks. Please try again later.");
    });

  document.getElementById("employee-details").style.display = "block";
  document.getElementById("login-form").style.display = "none";
  startLoginDurationTimer();
}

// Function to handle marking a task as completed
function markTaskAsCompleted(taskId) {
  fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "completed" }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message);
        });
      }
      return response.json();
    })
    .then((data) => {
      alert(`Task marked as completed: ${data.title}`);
      fetchEmployeeTasks();
    })
    .catch((error) => {
      console.error("Error marking task as completed:", error);
      alert(
        `Failed to mark task as completed. Please try again. Error: ${error.message}`
      );
    });
}

// Fetch and display tasks for the logged-in employee
function fetchEmployeeTasks() {
  const employeeId = document.getElementById("loginEmployeeId").value;

  fetch(`${BASE_URL}/employees/${employeeId}`)
    .then((response) => response.json())
    .then((employee) => {
      const taskList = document.getElementById("employee-tasks");
      taskList.innerHTML = ""; // Clear previous tasks
      employee.tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>Title:</strong> ${task.title}<br>
          <strong>Description:</strong> ${task.description}<br>
          <strong>Deadline:</strong> ${task.deadline}<br>
          <strong>Status:</strong> ${task.status}<br>
          <button onclick="markTaskAsCompleted(${task.id})">Mark as Completed</button>
        `;
        taskList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}

// Start timer to display login duration
function startLoginDurationTimer() {
  setInterval(() => {
    if (loginTime) {
      const now = new Date();
      const duration = Math.floor((now - loginTime) / 1000); // duration in seconds
      document.getElementById(
        "login-duration"
      ).textContent = `Logged in for: ${duration} seconds`;
    }
  }, 1000);
}

// Handle employee logout
document.getElementById("logout-button").addEventListener("click", function () {
  const employeeId = document.getElementById("loginEmployeeId").value;

  fetch(`${BASE_URL}/employees/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: employeeId }),
  })
    .then((response) => response.json())
    .then((employee) => {
      // Reset login time
      loginTime = null;
      // Reset the login form and display it
      document.getElementById("login-form").reset();
      document.getElementById("employee-details").style.display = "none";
      document.getElementById("login-form").style.display = "block";
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
    });
});
