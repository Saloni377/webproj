const express = require("express");
const router = express.Router();
const db = require("../db");

// Add a product to the wishlist
router.post("/", (req, res) => {
  const { ProductID, productName, Category, Description, PricePerDay, StockQuantity , ImageURL } = req.body;

  const query = `
    INSERT INTO BAG (ProductID, productName, Category, Description, PricePerDay, StockQuantity,Available , ImageURL)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [ProductID, productName, Category, Description, PricePerDay, StockQuantity, ImageURL], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Failed to add to wishlist", error: err });
    } else {
      res.status(201).json({ message: "Product added to wishlist successfully!" });
    }
  });
});

// Get all products in the wishlist
router.get("/", (req, res) => {
  const query = "SELECT * FROM BAG";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Failed to fetch wishlist", error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Remove a product from the wishlist
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM BAG WHERE ProductID = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Failed to remove product from wishlist", error: err });
    } else {
      res.status(200).json({ message: "Product removed from wishlist" });
    }
  });
});

module.exports = router;
