const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());

let employees = [
  {
    id: 1,
    name: "John Doe",
    cnp: "1234567890123",
    active: true,
    manager: "Jane Smith",
    loggedInAt: null,
    loggedOutAt: null,
  },
  {
    id: 2,
    name: "Alice Johnson",
    cnp: "9876543210987",
    active: true,
    manager: "Jane Smith",
    loggedInAt: null,
    loggedOutAt: null,
  },
];

let tasks = [];

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Route to get the list of employees
app.get("/employees", (req, res) => {
  res.json(employees);
});

// Route to add a new employee
app.post("/employees", (req, res) => {
  const { name, cnp, manager } = req.body;
  if (!name || !cnp || !manager) {
    return res
      .status(400)
      .json({ message: "Name, CNP, and manager are required" });
  }
  const newEmployee = {
    id: employees.length + 1,
    name,
    cnp,
    active: true,
    manager,
    loggedInAt: null,
    loggedOutAt: null,
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Route to delete an employee by ID
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex((emp) => emp.id === parseInt(id, 10));
  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }
  employees.splice(index, 1);
  res.status(204).send();
});

// Route to log in an employee by ID
app.post("/employees/login", (req, res) => {
  const { id } = req.body;
  const employee = employees.find((emp) => emp.id === parseInt(id, 10));
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  employee.loggedInAt = new Date();
  employee.loggedOutAt = null;
  res.json(employee);
});

// Route to log out an employee by ID
app.post("/employees/logout", (req, res) => {
  const { id } = req.body;
  const employee = employees.find((emp) => emp.id === parseInt(id, 10));
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  employee.loggedOutAt = new Date();
  res.json(employee);
});

// Route to update an employee's active status or responsible manager
app.patch("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { active, manager } = req.body;
  const employee = employees.find((emp) => emp.id === parseInt(id, 10));
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  if (active !== undefined) {
    employee.active = active;
  }
  if (manager) {
    employee.manager = manager;
  }
  res.json(employee);
});

// Route to get the list of tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Route to assign a task to an employee
app.post("/tasks", (req, res) => {
  const { employeeId, title, description, deadline, status } = req.body;
  if (!employeeId || !title || !description || !deadline || !status) {
    return res
      .status(400)
      .json({
        message:
          "Employee ID, title, description, deadline, and status are required",
      });
  }
  const task = {
    id: tasks.length + 1,
    employeeId: parseInt(employeeId, 10),
    title,
    description,
    deadline,
    status,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Route to assign a task to an employee by their ID
app.post("/employees/:id/tasks", (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, status } = req.body;

  // Log the request body to inspect the data being sent from the client
  console.log("Request Body:", req.body);

  if (!title || !description || !deadline || !status) {
    return res.status(400).json({
      message: "Title, description, deadline, and status are required",
    });
  }
  const employee = employees.find((emp) => emp.id === parseInt(id, 10));
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  const task = {
    id: tasks.length + 1,
    employeeId: employee.id,
    title,
    description,
    deadline,
    status,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Route to get the details of an employee including their tasks
app.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  const employee = employees.find((emp) => emp.id === parseInt(id, 10));
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  const employeeTasks = tasks.filter((task) => task.employeeId === employee.id);
  res.json({ ...employee, tasks: employeeTasks });
});

// Route to update task status by task ID
app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = tasks.find((task) => task.id === parseInt(id, 10));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (status) {
    task.status = status;
  }

  res.json(task);
});

// Route handler for the root endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
