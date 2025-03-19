const express = require("express");
const router = express.Router();
const db = require("../db");

// Add product to cart
router.post("/", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ status: "error", message: "User ID, Product ID, and Quantity are required" });
  }

  // Check stock availability
  const checkStockQuery = "SELECT stockQuantity FROM Product WHERE productId = ?";
  db.query(checkStockQuery, [productId], (err, stockResult) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ status: "error", message: "Database error", error: err });
    }

    const availableStock = stockResult[0]?.stockQuantity;
    if (!availableStock || availableStock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Only ${availableStock || 0} items are available in stock.`,
      });
    }

    // Insert into cart (or update quantity if item already exists)
    const insertCartQuery = `
      INSERT INTO Cart (userId, productId, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);
    `;

    db.query(insertCartQuery, [userId, productId, quantity], (err, result) => {
      if (err) {
        console.error("Error adding to cart:", err);
        return res.status(500).json({ status: "error", message: "Failed to add product to cart" });
      }

      // Decrease stock by the quantity added to cart
      const updateStockQuery = "UPDATE Product SET stockQuantity = stockQuantity - ? WHERE productId = ?";
      db.query(updateStockQuery, [quantity, productId], (err, stockUpdateResult) => {
        if (err) {
          console.error("Error updating stock:", err);
          return res.status(500).json({ status: "error", message: "Failed to update stock quantity" });
        }

        res.status(201).json({
          status: "success",
          message: `✅ Product added to cart. Stock updated.`,
          data: { cartId: result.insertId, userId, productId, quantity, remainingStock: availableStock - quantity },
        });
      });
    });
  });
});

// Get all cart items for a user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT C.cartId, C.quantity, P.productId, P.productName, P.pricePerDay, P.imageUrl
    FROM Cart C
    JOIN Product P ON C.productId = P.productId
    WHERE C.userId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({ status: "error", message: "Failed to fetch cart items" });
    }

    res.json({ status: "success", cart: results });
  });
});

// Remove product from cart
router.delete("/:cartId", (req, res) => {
  const { cartId } = req.params;

  // Step 1: Get productId & quantity from cart before deleting
  const checkCartQuery = "SELECT productId, quantity FROM Cart WHERE cartId = ?";
  db.query(checkCartQuery, [cartId], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ status: "error", message: "Database error", error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ status: "error", message: "Cart item not found" });
      }

      const { productId, quantity } = results[0];

      // Step 2: Delete the cart item
      const deleteCartQuery = "DELETE FROM Cart WHERE cartId = ?";
      db.query(deleteCartQuery, [cartId], (err, result) => {
          if (err) {
              console.error("Error removing from cart:", err);
              return res.status(500).json({ status: "error", message: "Failed to remove product from cart" });
          }

          // Step 3: Increase the stock quantity
          const updateStockQuery = "UPDATE Product SET stockQuantity = stockQuantity + ? WHERE productId = ?";
          db.query(updateStockQuery, [quantity, productId], (err, stockUpdateResult) => {
              if (err) {
                  console.error("Error updating stock:", err);
                  return res.status(500).json({ status: "error", message: "Failed to update stock quantity" });
              }

              res.status(200).json({ 
                  status: "success", 
                  message: `✅ Product removed from cart. Stock updated by ${quantity}.` 
              });
          });
      });
  });
});


router.put("/update-quantity", (req, res) => {
  const { cartId, newQuantity } = req.body;

  if (!cartId || newQuantity < 1) {
      return res.status(400).json({ status: "error", message: "Invalid cart item or quantity" });
  }

  // Step 1: Get current quantity and productId
  const getCartQuery = "SELECT productId, quantity FROM Cart WHERE cartId = ?";
  db.query(getCartQuery, [cartId], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ status: "error", message: "Database error" });
      }

      if (results.length === 0) {
          return res.status(404).json({ status: "error", message: "Cart item not found" });
      }

      const { productId, quantity: currentQuantity } = results[0];
      const quantityDifference = newQuantity - currentQuantity;

      // Step 2: Check stock availability if increasing quantity
      if (quantityDifference > 0) {
          const checkStockQuery = "SELECT stockQuantity FROM Product WHERE productId = ?";
          db.query(checkStockQuery, [productId], (err, stockResults) => {
              if (err) {
                  console.error("Database error:", err);
                  return res.status(500).json({ status: "error", message: "Database error" });
              }

              const availableStock = stockResults[0]?.stockQuantity || 0;
              if (availableStock < quantityDifference) {
                  return res.status(400).json({ 
                      status: "error", 
                      message: `Only ${availableStock} items are available in stock.` 
                  });
              }

              // Proceed with update
              updateCartQuantity();
          });
      } else {
          // If decreasing quantity, no need to check stock
          updateCartQuantity();
      }

      // Function to update cart and adjust stock
      function updateCartQuantity() {
          const updateCartQuery = "UPDATE Cart SET quantity = ? WHERE cartId = ?";
          db.query(updateCartQuery, [newQuantity, cartId], (err) => {
              if (err) {
                  console.error("Error updating cart quantity:", err);
                  return res.status(500).json({ status: "error", message: "Failed to update cart quantity" });
              }

              // Step 3: Adjust stock quantity
              const updateStockQuery = "UPDATE Product SET stockQuantity = stockQuantity - ? WHERE productId = ?";
              db.query(updateStockQuery, [quantityDifference, productId], (err) => {
                  if (err) {
                      console.error("Error updating stock:", err);
                      return res.status(500).json({ status: "error", message: "Failed to update stock quantity" });
                  }

                  res.json({ 
                      status: "success", 
                      message: `Cart updated successfully. Quantity: ${newQuantity}` 
                  });
              });
          });
      }
  });
});


module.exports = router;
