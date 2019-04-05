DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
product_name VARCHAR(60) NOT NULL,
department_name VARCHAR(60) NOT NULL,
price INT NOT NULL,
stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUE ("HD TV", "electronics", 778.98, 23),
("hangers", "home goods", 12.99, 88),
("radium girls", "books", 7.57, 53),
("summer top", "women's clothing", 28.99, 29),
("protein powder", "health", 49.89, 155),
("rake", "garden", 26.55, 64),
("espresso machine", "kitchen appliances", 259.99, 13),
("potato chips variety pack", "grocery", 19.89, 169),
("codenames", "toys and games", 16.88, 65),
("stapler", "office", 9.86, 117);

SELECT * FROM products;