const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',          // MySQL server location
  user: 'your_user',          // The user you created or 'root'
  password: 'your_password',  // The password for the user
  database: 'car_dealership'  // The name of your database
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
