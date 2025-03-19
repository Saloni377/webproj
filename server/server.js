const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Import routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const productsRoutes = require("./routes/products");
const wishlistRoutes = require("./routes/wishlist");
const cartRoutes = require("./routes/cart");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Use routes
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
