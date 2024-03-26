const db = require('../config/connection');

class EmployeeService {
    // Function to create a new employee
    async createEmployee(firstName, lastName, roleId, managerId) {
        try {
            const result = await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Function to get all employees
    async getAllEmployees() {
        try {
            const employees = await db.query('SELECT * FROM employee');
            return employees;
        } catch (error) {
            throw error;
        }
    }

    
}

module.exports = EmployeeService;