const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  // Enable CORS to handle requests from a different domain if needed

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// MySQL Database Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Assuming you're using the root user
  password: 'your_password',  // Replace with your actual password
  database: 'car_dealership'  // Your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create the '/search' route to handle search queries
app.get('/search', (req, res) => {
  const { condition, make, model, year } = req.query;

  let query = 'SELECT * FROM cars WHERE 1=1';
  if (condition) query += ` AND condition = ${connection.escape(condition)}`;
  if (make) query += ` AND make = ${connection.escape(make)}`;
  if (model) query += ` AND model = ${connection.escape(model)}`;
  if (year) query += ` AND year = ${connection.escape(year)}`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Database query error');
      return;
    }
    res.json(results);  // Send the query results as JSON
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
