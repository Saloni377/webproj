const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

// User registration route
router.post("/register", (req, res) => {
  const { name, phone, email, address, password } = req.body;

  if (!name || !phone || !email || !address || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO users (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [name, phone, email, address, password], (err, result) => {
    if (err) {
      console.error("Error registering user:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json({ success: true, message: "User registered successfully!" });
  });
});

module.exports = router;
