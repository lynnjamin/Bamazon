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
  showItems();
})

// MAIN FUNCTION //
function showItems() {
  console.log("Welcome to Scama... er.. Bamazon!\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    //display products with cli-table
    var table = new Table({
      head: ["ID", "PRODUCT NAME", "DEPARTMENT NAME", "PRICE", "STOCK"]
      , colWidths: [5, 30, 20, 10, 10]
    });
    var idArray = [];
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
      );
      idArray.push(res[i].id);
    }
    console.log(table.toString());
    main();
  })
}


function main() {
  inquirer
    .prompt([{
      name: "whatToDo",
      type: "list",
      message: "Would you like to [PURCHASE] an item, or [LEAVE]?",
      choices: ["PURCHASE", "LEAVE"]
    }]).then(function (res) {
      if (res.whatToDo === "LEAVE") {
        connection.end();
      } else {
        askUser();
      }
    })
}



function askUser() {
  inquirer
    .prompt([
      {
        name: "askId",
        type: "input",
        message: "Pick an ID",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "askQuantity",
        type: "input",
        message: "How many of the items do you want?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }]).then(function (answer) {
        connection.query("SELECT * FROM products where id = ?", [answer.askId], function (err, res) {
          if (err) throw err;
          chosenItem = parseInt(answer.askId);

          var chosenItem;
          var chosenIndex = chosenItem - 1;


          if (parseInt(answer.askQuantity) > res[0].stock_quantity) {
            console.log("Sorry our manager forgot to restock..");
          } else {
            //  console.log(res[0].id)
            connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?",
              [parseInt(res[0].stock_quantity) - parseInt(answer.askQuantity), parseInt(res[0].id)]
              , function (err, res) {
                if (err) throw err;
                connection.query("SELECT * FROM products", function (err, res) {
                  console.log("You've spent: $" + res[chosenIndex].price * answer.askQuantity);
                  main();
                })
              })
            }
          })
        })
      }
