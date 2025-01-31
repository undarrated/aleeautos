const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from your frontend
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",  // Change if you set a different username
  password: "",  // Enter your MySQL password
  database: "car_dealership"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// API to get cars based on search
app.get("/search", (req, res) => {
  const { status, make, model_year } = req.query;
  let query = "SELECT * FROM cars WHERE 1=1";

  if (status && status !== "New/Used") query += ` AND status = '${status}'`;
  if (make) query += ` AND make = '${make}'`;
  if (model_year) query += ` AND model_year = ${model_year}`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
