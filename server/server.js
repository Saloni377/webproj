const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // Import database connection
const loginRoutes = require("./routes/login"); // Import login route
const registerRoutes = require("./routes/register"); // Import register route
const productsRoutes = require("./routes/products"); // Import products route
const wishlistRoutes = require("./routes/wishlist");
const bagRoutes = require("./routes/bag");


const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/bag", bagRoutes);

app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/products", productsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
