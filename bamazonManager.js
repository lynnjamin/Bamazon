var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: "8889",
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  listChoices();
})


////////////////
// SHOW TABLE //
////////////////
var idArray = [];
function showItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    //display products with cli-table
    var table = new Table({
      head: ["ID", "PRODUCT NAME", "DEPARTMENT NAME", "PRICE", "STOCK"]
      , colWidths: [5, 30, 20, 10, 10]
    });
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
      idArray.push(res[i].id);
    }
    console.log(table.toString());
    listChoices();
  })
}


////////////////////
// VIEW LOW ITEMS //
////////////////////
function viewLow() {
  //look in database for items less or equal to 5 and display them
  connection.query("SELECT * FROM products WHERE stock_quantity<=?", [5], function (err, res) {
    if (err) throw err;

    var table = new Table({
      head: ["ID", "PRODUCT NAME", "DEPARTMENT NAME", "PRICE", "STOCK"]
      , colWidths: [5, 30, 20, 10, 10]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log(table.toString());
    listChoices();
  })
}


//////////////////////////////
// ADD TO INVENTORY FUNCTION//
//////////////////////////////
function addToInventory() {
  inquirer
    .prompt([
      {
        name: "idChoice",
        type: "input",
        message: "What ID do you want to restock?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How much do we need to restock?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          } else if (parseInt(value) > 0) {
            console.log("Please enter a valid ID")
          } else {
            return false;
          }
        }
      }]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE ?", { id: answer.idChoice }, function (err, res) {
          if (err) throw err;

          if (res.length === 0) {
            console.log(("\r\nYou should know your inventory better.. pick a valid ID\r\n"));
            listChoices();
          } else {
            var chosenProduct = res[0].product_name;
            console.log(chosenProduct)
            connection.query("UPDATE products SET ? WHERE ?",
              [{ stock_quantity: res[0].stock_quantity + parseInt(answer.quantity) },
              { id: answer.idChoice }],
              function (err) {
                if (err) throw err;
                console.log("\r\nYou successfully restocked " + answer.quantity + " " + chosenProduct + "!\r\n");
                listChoices();
              }
            );
          }
        });
      })
}


/////////////////////
// ADD NEW PRODUCT //
/////////////////////
function addNewProduct() {
  connection.query("SELECT department_name FROM products", function (err, res) {
    if (err) throw err;

    var department = [];
    for (var i = 0; i < res.length; i++) {
      department.push(res[i].department_name);
    }

    inquirer
      .prompt([
        {
          name: "productName",
          message: "What's the new product called?",
          type: "input",
        },
        {
          name: "departmentName",
          message: "Which department does this product fall into?",
          type: "list",
          choices: department
        },
        {
          name: "price",
          message: "How much does this product cost?",
          type: "input",
          validate: function (value) {
            if (!isNaN(value) && (parseInt(value) > 0)) {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          name: "stock",
          message: "Give it a quantity",
          type: "input",
          validate: function (value) {
            if (!isNaN(value) && (parseInt(value) > 0)) {
              return true;
            } else {
              return false;
            }
          },
        }]).then(function (answer) {
          connection.query("INSERT INTO products SET ?",
            {
              product_name: answer.productName,
              department_name: answer.departmentName,
              price: answer.price,
              stock_quantity: answer.stock
            },
            function (err) {
              if (err) throw err;
              console.log("\r\nA new product was successfully added!!\r\n")

              listChoices();
            })
        })
  })
}


function listChoices() {
  inquirer.prompt([{
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: ["VIEW PRODUCTS", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT", "QUIT"]
  }]).then(function (answer) {
    if (answer.menu === "VIEW PRODUCTS") {
      showItems();
    } else if (answer.menu === "VIEW LOW INVENTORY") {
      viewLow();
    } else if (answer.menu === "ADD TO INVENTORY") {
      addToInventory();
    } else if (answer.menu === "ADD NEW PRODUCT") {
      addNewProduct();
    } else {
      connection.end();
    }
  })
};