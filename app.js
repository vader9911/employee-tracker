const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
require('dotenv').config();

// Create the MySQL connection
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    console.log('Connected to MySQL database...');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Function to start the application
async function startApp() {
  const connection = await connectToDatabase();
  if (!connection) return;

  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  }).then(async (answer) => {
    switch (answer.action) {
      case 'View all departments':
        await viewDepartments(connection);
        break;
      case 'View all roles':
        await viewRoles(connection);
        break;
      case 'View all employees':
        await viewEmployee(connection);
        break;
      case 'Add a department':
        await addDepartment(connection);
        break;
      case 'Add a role':
        await addRole(connection);
        break;
      case 'Add an employee':
        await addEmployee(connection);
        break;
      case 'Update an employee role':
        await updateEmployeeRole(connection);
        break;
      case 'Exit':
        connection.end();
        break;
    }
  });
}

// Function to view all departments
async function viewDepartments(connection) {
    try {
      const [rows, fields] = await connection.execute('SELECT * FROM department');
      console.table(rows);
      startApp();
    } catch (error) {
      console.error('Error viewing departments:', error);
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
      console.error('Error viewing roles:', error);
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
      console.error('Error viewing employee:', error);
    }
  }

startApp();