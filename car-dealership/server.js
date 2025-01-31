const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_user', // Replace with the new user you created
  password: 'your_password', // Replace with your actual password
  database: 'your_database' // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
