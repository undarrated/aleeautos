const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // If you're using the root user, replace with actual username
  password: '', // If root has no password, leave empty
  database: 'car_dealership' // Use your actual database name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
