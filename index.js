const inquirer = require('inquirer');
const db = require('./db.js');


// "VIEW" Menu
//get data from the user on the DB
const viewMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'viewMenu',
        message: 'VIEWING:',
        choices: [{name:'All Departments', value:'department'}, {name:'All Roles', value:'role'}, {name:'All Employees', value:'employee'}, {name:'Employees by Department',value:'empDep'}, {name:'Employees by Manager', value:'empMan'}, {name:'Budget of a Department', value:'budget'}, {name: '<< Go Back', value:'back'}]
    })
    .then((selView) => { 
        if (selView.viewMenu === 'back'){return showMenu();}
        db.view(selView.viewMenu);
    });
};
//get info to add a new department to the DB
function addDepartment() {
    inquirer.prompt({type: 'input', name: 'name', message: 'What\'s the name of the new department? ', validate: name => {return (!name ? 'Write the title for the NEW role' : true);}})
    .then((data) => {
        db.add('department', 'name', `'${data.name}'`);
    });
};
//get info to add a NEW role to the DB
function addRole() {
    db.getData('id, name','department')
    .then(deps => {
        let arrayDeps = deps.map(({id, name}) => ({name: name, value: id}));
        let newRole = [{type: 'input', name: 'title', message: 'What\'s the title for the new role? ', validate: title => {return (!title ? 'Write the title for the new role' : true);}},
                       {type: 'input', name: 'salary', message: 'What\'s the salary for this role? ', validate: title => {return (isNaN(title) ? 'Please, write a valid salary' : true);}},
                       {type: 'list', name: 'department_id', message: 'Belongs to: ', choices: arrayDeps}];                
        inquirer.prompt(newRole)
        .then ((data) => {
            db.add('role', 'title, salary, department_id', `'${data.title}', ${data.salary}, ${data.department_id}`);
        });
    });
};
// //get info to and add a new employee to the DB
function addEmployee() {
    db.getData('id, title', 'role')
    .then((roles) => {
        let arrayRoles = roles.map(({id, title}) => ({name: title, value: id}));
        let newEmployee = [{type: 'input', name: 'first_name', message: 'First name: ', validate: first_name => {return (!first_name ? 'Please, write a name' : true);}},
                           {type: 'input', name: 'last_name', message: 'Last name: ', validate: last_name => {return (!last_name ? 'Please, write a last name' : true);}},
                           {type: 'list', name: 'role_id', message: 'Role: ', choices: arrayRoles}];        
        db.getData('id, first_name, last_name', 'employee', 'manager_id IS NULL')
        .then((managers) => {    
            let arrayManagers = managers.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));         
            arrayManagers.push({name: 'None', value: null});
            newEmployee.push({type: 'list', name: 'manager_id', message: 'Manager: ', choices: arrayManagers});
            inquirer.prompt(newEmployee)
            .then ((data) => {
                db.add('employee','first_name, last_name, role_id, manager_id', `'${data.first_name}', '${data.last_name}', ${data.role_id}, ${data.manager_id}`);
            });
        });
    });
};

//"ADD" Display MENU 
const addMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'addMenu',
        message: 'ADDING:',
        choices: [{name:'A Department', value:'department'}, {name:'A Role', value:'role'}, {name:'An Employee', value:'employee'}, {name:'<< Go Back', value:'back'}]
    })
    .then ((selAdd) => {
        switch(selAdd.addMenu) {
            case 'department': 
                addDepartment();
                break;
            case 'role':
                addRole();
                break;
            case 'employee':
                addEmployee();
                break;
            case 'back':
                showMenu();
                break;
            default:                
                break;
        }
    });
};
//Questions to be answered to UPDATE the DB
const updateEmployee = (id, data) => {
    inquirer.prompt(data)
    .then((updateData) => {        
        db.update('employee', `${id} = ${updateData.newInfo}`, `id = ${updateData.updateEmployee}`, 'Employee');
    });
};
//Array-questions to update employee's role OR employee's manager
const generateQuestions = (condition) => {
    let questions = [];    
    
    db.getData('id, first_name, last_name', 'employee')
    .then((data) => {  
        let employees = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id})); 
        questions.push({type: 'list', name: 'updateEmployee', message: 'Select an Employee:', choices: employees});
        if (condition === 'employeeRole') {
            db.getData('id, title', 'role')
            .then((data) => {
                let roles = data.map(({id, title}) => ({name: title, value: id}));
                questions.push({type: 'list', name: 'newInfo', message: 'Select the new role:', choices: roles});
                updateEmployee('role_id', questions);
            });
        }        
        if (condition === 'employeeManager') {
            db.getData('id, first_name, last_name', 'employee', 'manager_id IS NULL')
            .then((data) => {
                let managers = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
                questions.push({type: 'list', name: 'newInfo', message: 'Select the new Manager:', choices: managers});
                updateEmployee('manager_id', questions);
            });
        }
    });
};
//displays "UPDATES"
const updateMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'updateMenu',
        message: 'UPDATING:',
        choices: [{name:'Update an Employee Role', value:'employeeRole'}, {name:'Update an Employee Manager', value: 'employeeManager'}, {name:'<< Go Back', value:'back'}]
    })
    .then((selUpdate) => {
        if (selUpdate.updateMenu === 'back') { return showMenu(); }
        generateQuestions(selUpdate.updateMenu);
    });
};
//delete info by the user ON the DB
const deleteData = (questions, table, msg) => {
    inquirer.prompt(questions)
    .then((response) => {
        if (!response.deleting) {
            return showMenu();
        }
        db.toDelete(table, response.toDelete, msg);                        
    });
};
// "Delete" Menu (departments/roles or employees)
const deleteMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'deleteMenu',
        message: 'DELETING: ',
        choices: [{name:'Delete a department', value:'department'}, {name:'Delete a role', value:'role'}, {name:'Delete an employee', value:'employee'}, {name:'<< Go Back', value:'back'}]
    }).then((selDelete) => {
        let arrayDeps = [];
        let confirmDelete = [{type: 'confirm', name: 'deleting', message: 'This action will delete all related data. Do you want to cotinue?'}];        
        switch(selDelete.deleteMenu) {
            case 'department':
                db.getData('id, name', selDelete.deleteMenu)
                .then((departments) => {
                    arrayDeps = departments.map(({id, name}) => ({name : name, value: id}));
                    confirmDelete.unshift({type: 'list', name: 'toDelete', message: `Select the ${selDelete.deleteMenu} you want to delete:`, choices: arrayDeps});
                    deleteData(confirmDelete, 'department', 'Department and related data were successfully deleted!');
                });                
                break;
            case 'role':
                db.getData('id, title', selDelete.deleteMenu)
                .then((roles) => {
                    arrayDeps = roles.map(({id, title}) => ({name: title, value: id}));
                    confirmDelete.unshift({type: 'list', name: 'toDelete', message: `Select the ${selDelete.deleteMenu} you want to delete:`, choices: arrayDeps});
                    deleteData(confirmDelete, 'role', 'Role successfully deleted!');
                });
                break;
            case 'employee':
                db.getData('id, first_name, last_name', selDelete.deleteMenu)
                .then((employees) => {
                    arrayDeps = employees.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
                    confirmDelete.unshift({type: 'list', name: 'toDelete', message: `Select the ${selDelete.deleteMenu} you want to delete:`, choices: arrayDeps});
                    deleteData(confirmDelete, 'employee', 'The selected employee was successfully deleted!');
                });                
                break;
            case 'back':
                return showMenu();
        }
    });
};
//Main menu
const showMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: ['View', 'Add', 'Update', 'Delete', 'Exit']        
    })
    .then((selMain) => {
        switch(selMain.mainMenu) {
            case 'View':
                return viewMenu();
            case 'Add':
                return addMenu();
            case 'Update':
                return updateMenu();            
            case 'Delete':
                return deleteMenu();
            default:                
                return process.exit();                
        }
    });
};
//start APP
showMenu();

module.exports.showMenu = showMenu;