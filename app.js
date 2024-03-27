const inquirer = require('inquirer');

const { DepartmentService, RoleService, EmployeeService } = require('./services/index');

// const connectToDatabase = require('./config/connection');


async function start() {
    
    
    

    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'Add an employee',
                'View all employees',
                'Update an employee role',
                'Exit'
            ]
        }
        
    ]);

    switch (choice) {
        case 'Add an employee':
            const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Enter the role ID for the employee:'
                },
                {
                    type: 'input',
                    name: 'managerId',
                    message: 'Enter the manager ID for the employee (leave empty if none):'
                }
            ]);
            await EmployeeService.addEmployee(firstName, lastName, roleId, managerId);
            console.log('Employee added successfully.');
            start();
            break;

        case 'View all employees':
            const employees = await EmployeeService.getAllEmployees();
            console.table(employees);
            start();
            break;

        case 'Exit':
            console.log('Exiting...');
            process.exit(0);
    }
}

start();