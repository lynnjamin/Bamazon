var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var counter;
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

// DISPLAY TABLE //
console.log("\r\nWelcome to Bamazon!\r\n");
function showItems() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    
    //display products with cli-table
    var table = new Table({
      head: ["ID", "PRODUCT NAME", "DEPARTMENT NAME", "PRICE", "STOCK"]
      , colWidths: [5, 30, 20, 10, 10]
    });
    var idArray = [];
    counter= idArray.length;
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

// ASK WHAT TO DO //
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

// ID AND QUANTITY PURCHASE //
function askUser(res) {
  inquirer
    .prompt([
      {
      name: "askId",
      type: "input",
      message: "Pick an ID",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        } else if (parseInt(value) > counter) {
          console.log("Please enter a valid id")
          return false;
        } else {
          console.log("Not valid")
          return false;
          }
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
          
          var chosenItem = parseInt(answer.askId);
          var chosenIndex = chosenItem - 1;

          if(res.length==0) {
            console.log("\r\nThat item is not on our list!\r\n");
            main();
          } else if
            (parseInt(answer.askQuantity) > res[0].stock_quantity) {
            console.log("\r\nSorry our manager forgot to restock..\r\n");
            main();
          } else {
            connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?",
              [parseInt(res[0].stock_quantity) - parseInt(answer.askQuantity), parseInt(res[0].id)]
              , function (err, res) {
                if (err) throw err;
                connection.query("SELECT * FROM products", function (err, res) {
                showItems();
                console.log("\r\nYou spent: $" + res[chosenIndex].price * answer.askQuantity + "\r\n");
                })
              })
          }
        })
      })
  }
	