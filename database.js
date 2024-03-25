const express = require('express');
const dotenv = require('dotenv').config(); // Immediately call config
const mysql = require('mysql2');

// Create Express app
const app = express();

// Load environment variables from .env file
// dotenv.config(); // This has been moved up and merged with the require

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: 3306, // This is the default MySQL port, specifying is optional unless it's different
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Connect to the database
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log(`Connected to MySQL database: ${process.env.MYSQL_DATABASE}`);
});

// Example route for fetching a product by ID
app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Products WHERE Product_ID = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      res.status(500).send('Error fetching product');
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
