const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

// Import routes
const productRoutes = require("./routes/products");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login"); // Import login route
app.use("/api/login", loginRoutes); // Set API path for login


// Use routes
app.use("/api/products", productRoutes);
app.use("/api/auth", registerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
