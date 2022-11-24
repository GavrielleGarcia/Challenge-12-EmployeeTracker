INSERT INTO department (name)
VALUES ('Sales'),
       ('Finance'),
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 50000, 1),
       ('Sales executive', 2000, 1),       
       ('Account Manager', 75000, 2),
       ('Accountant', 45000, 2),
       ('Legal Team Lead', 60000, 3),
       ('Lawyer', 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alitzel', 'Berra', 1, null),
       ('Mariana', 'Guzman', 2, 1),       
       ('Diego', 'Lozano', 3, null),
       ('Judith', 'Dominguez', 4, 3),
       ('Roman', 'Gonzalez', 5, null),
       ('Ronaldo', 'Medina', 6, 5); 