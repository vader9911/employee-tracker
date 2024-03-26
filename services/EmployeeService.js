const connection = require('../config/connection');

class EmployeeService {
    // Function to create a new employee
    static async addEmployee(firstName, lastName, roleId, managerId) {
        await connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    }

    // Function to get all employees
    static async getAllEmployees() {
        const [rows] = await connection.query('SELECT * FROM employees');
        return rows;
    }


    // Function to update an employee's role
    static async updateEmployeeRole(employeeId, newRoleId) {
        await connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
    }
    
}

module.exports = EmployeeService;