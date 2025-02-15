const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const productsRoutes = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/products", productsRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
