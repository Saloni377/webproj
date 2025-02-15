const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

// Search endpoint
router.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const query = `SELECT * FROM accessories WHERE name LIKE ? OR category LIKE ?`;
  const searchTerm = `%${q}%`;

  db.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error("Error fetching search results:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json(results);
  });
});

module.exports = router;
