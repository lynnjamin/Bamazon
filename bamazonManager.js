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


   function showItems() {
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
       listChoices();
     })
   }


   function viewLow() {
connection.query()

   }

   function addToInventory(){

   }

   function addNewProduct(){


   }


   function listChoices() {
        inquirer.prompt([{
          name: "menu",
          type: "list",
          message: "What would you like to do?",
          choices: ["VIEW PRODUCTS", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT", "QUIT"]
        }]).then(function (answer) {
          if(answer.menu === "VIEW PRODUCTS") {
               showItems();
          } else if (answer.menu === "VIEW LOW INVENTORY") {
               
          } else if (answer.menu === "ADD TO INVENTORY") {

          } else if (answer.menu === "ADD NEW PRODUCT") {

          } else {
               connection.end();
          }
        })
   }