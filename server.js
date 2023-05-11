const cTable = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");
let roleArr = [];

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

function selectRole() {
  db.query("SELECT * FROM roles", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      roleArr.push(results[i].title);
    }
  });
  return roleArr;
}

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
        message: "What is the first name of the new employee?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the new employee's last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the new employee's role?",
        name: "role",
        choices: selectRole(),
      },
    ])
    .then((ans) => {
      const roleId = roleArr.indexOf(ans.role) + 1;
      db.query(
        `INSERT INTO employees(first_name, last_name, role_id)
          VALUES(?, ?, ?)`,
        [ans.firstName, ans.lastName, roleId],
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
        message: "What is the title of the new role?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "What is the salary for the new role?",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department will this new role be in?",
        name: "addDept",
        choices: deptChoices,
      },
    ])
    .then((ans) => {
      db.promise()
        .query(`SELECT id FROM department WHERE name = ?`, ans.addDept)
        .then((answer) => {
          let mappedId = answer[0].map((obj) => obj.id);
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
        message: "What is the name of the new department?",
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
  let employeeArr = [];
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title 
     FROM employees
     JOIN roles ON employees.role_id = roles.id`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      for (var i = 0; i < results.length; i++) {
        employeeArr.push(
          `${results[i].id} ${results[i].first_name} ${results[i].last_name} ${results[i].title}`
        );
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's needs a role change?",
            name: "changeEmp",
            choices: employeeArr,
          },
          {
            type: "list",
            message: "What will their new role be?",
            name: "newRole",
            choices: selectRole(),
          },
        ])
        .then((ans) => {
          let roleId = selectRole().indexOf(ans.newRole) + 1;
          let employeeId = parseInt(ans.changeEmp.split(" ")[0]);
          db.query(
            `UPDATE employees SET role_id = ? WHERE id = ?`,
            [roleId, employeeId],
            (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(`\nNew role applied!\n`);
              init();
            }
          );
        });
    }
  );
}