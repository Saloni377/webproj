const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../db"); // Import database connection

// User registration route
router.post("/register", (req, res) => {
  const { name, phone, email, address, password } = req.body;

  if (!name || !phone || !email || !address || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Hash the password before storing
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    const query =
      "INSERT INTO users (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [name, phone, email, address, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error registering user:", err.sqlMessage);
        return res.status(500).json({ error: err.sqlMessage });
      }
      res.json({ success: true, message: "User registered successfully!" });
    });
  });
});

module.exports = router;
