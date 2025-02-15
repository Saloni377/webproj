const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

// Login API
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  // Check if user exists in the database
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      res.json({ success: true, message: "Login successful", user: results[0] });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

module.exports = router;
