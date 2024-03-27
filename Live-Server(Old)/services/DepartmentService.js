const connection = require('../config/connection');

class DepartmentService {
    // Function to get all departments
    static async getAllDepartments() {
        const [rows] = await connection.query('SELECT * FROM departments');
        return rows;
    }

    // Function to add a department
    static async addDepartment(name) {
        await connection.query('INSERT INTO departments (name) VALUES (?)', [name]);
    }
}



module.exports = DepartmentService;