-- Inserting data into department table
INSERT INTO department (name) VALUES 
('Engineering'),
('Marketing'),
('Finance');

-- Inserting data into role table
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000.00, 1),
('Product Manager', 90000.00, 1),
('Marketing Specialist', 60000.00, 2),
('Financial Analyst', 75000.00, 3);

-- Inserting data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 1, 1),
('Michael', 'Johnson', 2, 1),
('Emily', 'Williams', 3, 1),
('David', 'Brown', 4, NULL);
