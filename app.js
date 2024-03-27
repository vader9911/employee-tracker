const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
require("dotenv").config();

// Create the MySQL connection
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log("Connected to MySQL database...");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Function to start the application
async function startApp() {
  const connection = await connectToDatabase();
  if (!connection) return;

  // Prompt for user input
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],

      // Run function based on user input
    })
    .then(async (answer) => {
      switch (answer.action) {
        case "View all departments":
          await viewDepartments(connection);
          break;
        case "View all roles":
          await viewRoles(connection);
          break;
        case "View all employees":
          await viewEmployee(connection);
          break;
        case "Add a department":
          await addDepartment(connection);
          break;
        case "Add a role":
          await addRole(connection);
          break;
        case "Add an employee":
          await addEmployee(connection);
          break;
        case "Update an employee role":
          await updateEmployeeRole(connection);
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// Function to view all departments
async function viewDepartments(connection) {
  try {
    const [rows, fields] = await connection.execute("SELECT * FROM department");
    console.table(rows);
    startApp();
  } catch (error) {
    console.error("Error viewing departments:", error);
  }
}

// Function to view all roles
async function viewRoles(connection) {
  try {
    const [rows, fields] = await connection.execute(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        LEFT JOIN department ON role.department_id = department.id
      `);
    console.table(rows);
    startApp();
  } catch (error) {
    console.error("Error viewing roles:", error);
  }
}

// Function to view all employees
async function viewEmployee(connection) {
  try {
    const [rows, fields] = await connection.execute(`
        SELECT 
          employee.id,
          employee.first_name,
          employee.last_name,
          role.title AS role,
          role.salary,
          CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM 
          employee
        LEFT JOIN 
          role ON employee.role_id = role.id
        LEFT JOIN 
          employee AS manager ON employee.manager_id = manager.id
      `);
    console.table(rows);
    startApp();
  } catch (error) {
    console.error("Error viewing employee:", error);
  }
}

// Function to add a department
async function addDepartment(connection) {
  // Fetch the necessary tables
  try {
    const answer = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the department:",
    });

    // Push changes to DB using prepared statement
    const [result] = await connection.execute(
      "INSERT INTO department (name) VALUES (?)",
      [answer.name]
    );
    console.log("Department added successfully. ID:", result.insertId);
    startApp();
  } catch (error) {
    console.error("Error adding department:", error);
  }
}

// Function to add an employee
async function addEmployee(connection) {
  // Fetch the necessary tables
  try {
    const roles = await connection.execute("SELECT id, title FROM role");
    const roleChoices = roles[0].map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const managers = await connection.execute(
      "SELECT id, first_name, last_name FROM employee"
    );
    const managerChoices = managers[0].map((manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));

    managerChoices.push({ name: "None", value: null });

    // Prompt for user input
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "role_id",
        message: "Select the role for the employee:",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Select the manager for the employee:",
        choices: managerChoices,
      },
    ]);

    // Push changes to DB using prepared statement
    const [result] = await connection.execute(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]
    );
    console.log("Employee added successfully. ID:", result.insertId);
    startApp();
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Function to add a role
async function addRole(connection) {
  // Fetch the necessary tables
  try {
    const departments = await connection.execute(
      "SELECT id, name FROM department"
    );
    const departmentChoices = departments[0].map((department) => ({
      name: department.name,
      value: department.id,
    }));

    // Prompt for user input
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary for the role:",
      },
      {
        type: "list",
        name: "department_id",
        message: "Select the department for the role:",
        choices: departmentChoices,
      },
    ]);

    // Push changes to DB using prepared statement
    const [result] = await connection.execute(
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
      [answer.title, answer.salary, answer.department_id]
    );
    console.log("Role added successfully. ID:", result.insertId);
    startApp();
  } catch (error) {
    console.error("Error adding role:", error);
  }
}

// Function to update an employee role
async function updateEmployeeRole(connection) {
  // Fetch the necessary tables
  try {
    const employees = await connection.execute(
      "SELECT id, first_name, last_name FROM employee"
    );
    const employeeChoices = employees[0].map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const roles = await connection.execute("SELECT id, title FROM role");
    const roleChoices = roles[0].map((role) => ({
      name: role.title,
      value: role.id,
    }));

    // Prompt for user input
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "employee_id",
        message: "Select the employee to update:",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "role_id",
        message: "Select the new role for the employee:",
        choices: roleChoices,
      },
    ]);

    // Push changes to DB using prepared statement
    await connection.execute("UPDATE employee SET role_id = ? WHERE id = ?", [
      answer.role_id,
      answer.employee_id,
    ]);
    console.log("Employee role updated successfully.");
    startApp();
  } catch (error) {
    console.error("Error updating employee role:", error);
  }
}

// Start the app
startApp();