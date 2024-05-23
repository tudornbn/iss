// URL of the backend server
const BASE_URL = "http://localhost:3000";

// Fetch and display the list of employees with detailed information
function fetchEmployees() {
  fetch(`${BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      const employeeList = document.getElementById("employee-list");
      employeeList.innerHTML = ""; // Clear previous list
      data.forEach((employee) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong>ID:</strong> ${employee.id}<br>
          <strong>Name:</strong> ${employee.name}<br>
          <strong>CNP:</strong> ${employee.cnp}<br>
          <strong>Manager:</strong> ${employee.manager}<br>
          <strong>Active:</strong> ${employee.active}<br>
          <strong>Tasks:</strong>
          <ul id="tasks-${employee.id}"></ul>
          <button onclick="toggleActive(${employee.id}, ${!employee.active})">
            Set ${employee.active ? "Inactive" : "Active"}
          </button>
          <button onclick="deleteEmployee(${employee.id})">Delete</button>
        `;
        employeeList.appendChild(listItem);
        fetchTasksForEmployee(employee.id);
      });
    });
}

// Fetch tasks for a specific employee and display them
function fetchTasksForEmployee(employeeId) {
  fetch(`${BASE_URL}/tasks`)
    .then((response) => response.json())
    .then((data) => {
      const taskList = document.getElementById(`tasks-${employeeId}`);
      taskList.innerHTML = ""; // Clear previous tasks
      data
        .filter((task) => task.employeeId === employeeId)
        .forEach((task) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <strong>Title:</strong> ${task.title}<br>
            <strong>Description:</strong> ${task.description}<br>
            <strong>Deadline:</strong> ${task.deadline}<br>
            <strong>Status:</strong> ${task.status}<br>
          `;
          taskList.appendChild(listItem);
        });
    });
}

document
  .getElementById("assign-task-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const employeeId = document.getElementById("assignEmployeeId").value;
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const deadline = document.getElementById("taskDeadline").value; // Add this line to capture the task deadline
    const status = document.getElementById("taskStatus").value; // Add this line to capture the task status

    fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        title,
        description,
        deadline,
        status,
      }), // Include all necessary data in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        alert(
          `Task assigned to Employee ID ${employeeId}: ${data.description}`
        );
        fetchEmployees();
      })
      .catch((error) => {
        console.error("Error assigning task:", error);
        alert("Failed to assign task. Please try again.");
      });
  });

// Add new employee
if (document.getElementById("add-employee-form")) {
  document
    .getElementById("add-employee-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const cnp = document.getElementById("cnp").value;
      const manager = document.getElementById("manager").value;

      fetch(`${BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, cnp, manager }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(`Employee added: ${data.name}`);
          fetchEmployees();
        });
    });
}

// Delete employee
function deleteEmployee(employeeId) {
  fetch(`${BASE_URL}/employees/${employeeId}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      alert(`Employee with ID ${employeeId} deleted`);
      fetchEmployees();
    } else {
      alert(`Employee with ID ${employeeId} not found`);
    }
  });
}

// Initial fetch of employee data
fetchEmployees();
