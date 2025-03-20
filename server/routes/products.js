const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

// 🔎 Search Products by Name or Category
router.get("/search", (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Search query cannot be empty" });
  }

  const searchTerm = `%${q}%`;
  const query = `
    SELECT *, CONCAT('http://localhost:5000/images/', imageURL) AS fullImageURL 
    FROM Product
    WHERE LOWER(productName) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?)
  `;

  db.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error("❌ Error fetching search results:", err.sqlMessage);
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }

    res.json(results.length > 0 ? results : []);
  });
});

// 🔍 Get Product Details by ID
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT *, CONCAT('http://localhost:5000/images/', imageURL) AS fullImageURL 
    FROM Product 
    WHERE productId = ?
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching product details:", err.sqlMessage);
      return res.status(500).json({ error: "Database error", details: err.sqlMessage });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(results[0]); // ✅ Return a single product object
  });
});





module.exports = router;
