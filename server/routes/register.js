const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

// Register Route
router.post("/", (req, res) => {
  console.log("Received Request Body:", req.body); // ✅ Log request body

  const { userName, userPhoneNumber, userEmail, userAddress, userPassword } = req.body;

  if (!userName?.trim() || !userPhoneNumber?.trim() || !userEmail?.trim() || !userAddress?.trim() || !userPassword?.trim()) {
    return res.status(400).json({ error: "All fields are required" });
  }
  

  // Check if the email is already registered
  const checkEmailQuery = "SELECT * FROM User WHERE userEmail = ?";
  db.query(checkEmailQuery, [userEmail], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    bcrypt.hash(userPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err.message);
        return res.status(500).json({ error: "Error hashing password" });
      }

      // Insert the new user
      const query = `
        INSERT INTO User (userName, userPhoneNumber, userEmail, userAddress, userPassword)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(query, [userName, userPhoneNumber, userEmail, userAddress, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ error: "Database error", details: err.message });
        }

        res.json({ success: true, message: "User registered successfully!" });
      });
    });
  });
});

module.exports = router;
