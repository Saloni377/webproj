const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));


// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost", // Change if your DB is hosted elsewhere
  user: "root",      // Your MySQL username
  password: "yarizata",      // Your MySQL password
  database: "rental_db", // Change to your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Search endpoint
app.get("/api/products/search", (req, res) => {
    const { q } = req.query; 
    if (!q) return res.json([]);

    // Search for keyword in both `name` and `category`
    const query = `SELECT * FROM accessories WHERE name LIKE ? OR category LIKE ?`;
    const searchTerm = `%${q}%`;

    db.query(query, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error("Error fetching search results:", err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.json(results); // Return multiple matching results
    });
});

  
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
