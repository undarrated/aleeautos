const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Change this if your MySQL user is different
    password: "",  // Add your MySQL password if set
    database: "car_dealership"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database");
});

// Search API
app.get("/search", (req, res) => {
    const { condition, make, model } = req.query;
    
    let sql = "SELECT * FROM cars WHERE 1=1"; // Base query

    if (condition !== "New/Used") sql += ` AND condition = '${condition}'`;
    if (make) sql += ` AND make = '${make}'`;
    if (model) sql += ` AND model = '${model}'`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching cars:", err);
            res.status(500).send("Server error");
            return;
        }
        res.json(results);
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
