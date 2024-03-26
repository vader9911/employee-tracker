const connection = require('../config/connection');

class RoleService {
    static async getAllRoles() {
        const [rows] = await connection.query('SELECT * FROM roles');
        return rows;
    }

    static async addRole(title, salary, departmentId) {
        await connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    }
}



module.exports = RoleService;