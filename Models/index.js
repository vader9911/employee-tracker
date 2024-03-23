const Employee = require('./employee');
const Department = require('./department');
const Role = require('./role');


// Departments have many Roles
Department.hasMany(Role, {
  foreignKey: "department_id",
});

// Roles have one Department
Role.hasMany(Employee, {
    foreignKey: "department_id,
  });


// Roles have many Employees
Role.hasMany(Employee, {
  foreignKey: "role_id",
});


// Employee hasOne Role
Employee.hasOne(Role, {
  foreignKey: "role_id",
});

module.exports = {
    Employee,
    Department,
    Role
};