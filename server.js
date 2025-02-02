const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON data in requests

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "66025117_Ao1",
    database: "aleeautos"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Get all cars or filter by search query
app.get("/cars", (req, res) => {
    let sql = "SELECT * FROM cars";
    let params = [];

    if (req.query.search) {
        sql += " WHERE make LIKE ? OR model LIKE ?";
        params = [`%${req.query.search}%`, `%${req.query.search}%`];
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching cars:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});

// Get a specific car by ID
app.get("/cars/:id", (req, res) => {
    const sql = "SELECT * FROM cars WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error("Error fetching car:", err);
            res.status(500).json({ error: "Database error" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Car not found" });
        } else {
            res.json(results[0]);
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});


// Add this to server.js (below existing routes)

// Handle inquiries submission
app.post("/inquiries", (req, res) => {
    const { name, email, message, car_id } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO inquiries (name, email, message, car_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, message, car_id], (err, result) => {
        if (err) {
            console.error("Error saving inquiry:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json({ success: true, message: "Inquiry submitted successfully" });
        }
    });
});

