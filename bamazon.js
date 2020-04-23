var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "rootuser",
  database: "bamazon_db",
});

connection.connect(function (err) {
  if (err) throw err;

  start();
});

function start() {
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
      },
      {
        name: "itemQty",
        type: "input",
        message: "How many units would you like to purchase?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "select * from products where ?",
        {
          id: parseInt(answer.itemID),
        },
        function (error, product) {
          console.log(product[0].stock_quantity);
          console.log(parseInt(answer.itemQty));
          if (parseInt(answer.itemQty) <= product[0].stock_quantity) {
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: product[0].stock_quantity - answer.itemQty,
                },
                {
                  id: answer.itemID,
                },
              ],
              function (error) {
                if (error) throw error;
                console.log("your order has been placed!");
                connection.end();
              }
            );
          } else {
            console.log("insufficient quantity in stock");
          }
        }
      );
    });
}
