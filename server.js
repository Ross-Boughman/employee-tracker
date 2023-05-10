const cTable = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please pick from the following:",
        name: "initialize",
        choices: [
          "View employees",
          "View roles",
          "View departments",
          "Add employee",
          "Add role",
          "Add department",
          "Change employee role",
          "Exit",
        ],
      },
    ])
    .then((ans) => {
      // console.log(ans.initialize);
      switch (ans.initialize) {
        case "View employees":
          viewEmployee();
          break;
        case "View roles":
          viewRole();
          break;
        case "View departments":
          viewDept();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add role":
          addRole();
          break;
        case "Add department":
          addDept();
          break;
        case "Change employee role":
          changeEmployee();
          break;
        case "Exit":
          console.log("Exited");
          process.exit();
      }
    })
    .catch((err) => console.error(err));
};

init();

const viewEmployee = () => {
  db.query(`SELECT * FROM employees`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  });
};

const viewRole = () => {
  db.query(`SELECT * FROM roles`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  });
};

const viewDept = () => {
  db.query(`SELECT * FROM department`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  });
};


const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
    ])
    .then((ans) => {
      db.query(
        `INSERT INTO employees(first_name, last_name)
                    VALUES(?, ?)`,
        [ans.firstName, ans.lastName],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            db.query(`SELECT * FROM employees`, (err, results) => {
              err ? console.error(err) : console.table(results);
              init();
            });
          }
        }
      );
    });
};


const addRole = () => {
  const deptChoices = () =>
    db
      .promise()
      .query(`SELECT * FROM department`)
      .then((rows) => {
        let arrNames = rows[0].map((obj) => obj.name);
        return arrNames;
      });
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role you'd like to add?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department is this role in?",
        name: "addDept",
        choices: deptChoices,
      },
    ])
    .then((ans) => {
      db.promise()
        .query(`SELECT id FROM department WHERE name = ?`, ans.addDept)
        .then((answer) => {
          let mappedId = answer[0].map((obj) => obj.id);
          // console.log(mappedId[0])
          return mappedId[0];
        })
        .then((mappedId) => {
          db.promise().query(
            `INSERT INTO roles(title, salary, department_id)
                VALUES(?, ?, ?)`,
            [ans.roleTitle, ans.roleSalary, mappedId]
          );
          init();
        });
    });
};


const addDept = () => {
  inquirer  
    .prompt([
      {
        type: "input",  
        message: "What is the name of the department you'd like to add?",
        name: "addDept",
      },  
    ])  
    .then((ans) => {
      db.query(
        `INSERT INTO department(name)  
                    VALUES(?)`,
        ans.addDept,            
        (err, results) => {
          if (err) {
            console.log(err);  
          } else {
            db.query(`SELECT * FROM department`, (err, results) => {
              err ? console.error(err) : console.table(results);  
              init();
            });  
          }  
        }  
      );  
    });  
};    


function changeEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(val) {
        var roleId = selectRole().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            startPrompt()
        })
  
    });
  });

  }