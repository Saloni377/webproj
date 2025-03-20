const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

// Register Route
router.post("/", async (req, res) => {
  console.log("Received Request Body:", req.body);
  const { userName, userPhoneNumber, userEmail, userAddress, userPassword, confirmPassword, role } = req.body;

  // Validate input fields
  if (![userName, userPhoneNumber, userEmail, userAddress, userPassword, confirmPassword].every(field => field?.trim())) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate email and phone formats
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!/^\d{10}$/.test(userPhoneNumber)) {
    return res.status(400).json({ error: "Phone number must be 10 digits" });
  }

  // Check if passwords match
  if (userPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Ensure role is either 'renter' or 'lender'
  const validRoles = ["renter", "lender"];
  const userRole = validRoles.includes(role) ? role : "renter"; // Default to renter

  try {
    // Check if the email is already registered
    const [emailCheck] = await db.promise().query("SELECT * FROM User WHERE userEmail = ?", [userEmail]);
    if (emailCheck.length) return res.status(409).json({ error: "Email is already registered" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Insert new user
    const [result] = await db.promise().query(
      "INSERT INTO User (userName, userPhoneNumber, userEmail, userAddress, userPassword, role) VALUES (?, ?, ?, ?, ?, ?)",
      [userName, userPhoneNumber, userEmail, userAddress, hashedPassword, userRole]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

module.exports = router;
