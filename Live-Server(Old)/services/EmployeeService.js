const pool = require('../config/connection');

class EmployeeService {
    // Function to create a new employee
    static async addEmployee(firstName, lastName, roleId, managerId) {
        const connection = await pool.getConnection();
        try {
            await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }

    // Function to get all employees
    static async getAllEmployees() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM employee');
            return rows;
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }

    // Function to update an employee's role
    static async updateEmployeeRole(employeeId, newRoleId) {
        const connection = await pool.getConnection();
        try {
            await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }
}

module.exports = EmployeeService;