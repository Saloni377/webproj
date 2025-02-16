const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

// Search endpoint
router.get("/search", (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Search query cannot be empty" });
  }

  const searchTerm = `%${q}%`;
  const query = `
    SELECT * FROM Product
    WHERE LOWER(productName) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?)
  `;

  db.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error("Error fetching search results:", err.sqlMessage);
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }

    if (results.length === 0) {
      return res.json({ message: "No accessories found matching your search." });
    }

    res.json(results);
  });
});

module.exports = router;
