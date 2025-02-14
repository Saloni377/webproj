const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "sqluser", // Change if necessary
  password: "password", // Change if necessary
  database: "rental_db",
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to MySQL");
});

// Search API Endpoint
app.get("/api/search", (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query parameter is required" });

  const sql = `SELECT * FROM accessories WHERE name LIKE ? OR category LIKE ?`;
  db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
