const express = require('express');
const app = express();
const mysql = require('mysql');

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'car_dealership'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint for searching cars
app.get('/search', (req, res) => {
  const { condition, make, model } = req.query; // Capture search params from query string

  // Construct the SQL query based on search parameters
  let query = 'SELECT * FROM cars WHERE 1=1'; // base query
  if (condition) query += ` AND condition = '${condition}'`;
  if (make) query += ` AND make = '${make}'`;
  if (model) query += ` AND model = '${model}'`;

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
      return;
    }
    res.json(results); // Send the results back to the frontend
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
