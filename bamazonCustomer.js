var mysql = require('mysql');

var connection = mysql.createConnection({
     host     : 'localhost',
     user     : 'root',
     password : 'root',
     port: "8889",
     database : 'bamazon'
   });
    
   connection.connect();
    
   connection.query('SELECT * FROM `products`', function (error, results, fields) {
     if (error) throw error;
     console.log(results);
   });

   connection.end();