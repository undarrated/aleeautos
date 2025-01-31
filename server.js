const express = require('express');
const mysql = require('mysql');
const app = express();

// Create the connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password', // Use your MySQL password here
  database: 'car_dealership'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route to handle search
app.get('/search', (req, res) => {
  const { condition, make, model, year } = req.query;

  let query = 'SELECT * FROM cars WHERE 1=1';
  if (condition) query += ` AND condition = '${connection.escape(condition)}'`;
  if (make) query += ` AND make = '${connection.escape(make)}'`;
  if (model) query += ` AND model = '${connection.escape(model)}'`;
  if (year) query += ` AND year = ${connection.escape(year)}`;

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
