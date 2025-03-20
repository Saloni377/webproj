const express = require("express");
const router = express.Router();
const db = require("../db");

// Place an order
router.post("/place-order", async (req, res) => {
    const { userId, cartItems, totalAmount, paymentMethod, address } = req.body;

    if (!userId || !cartItems || cartItems.length === 0 || !totalAmount || !address) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        // Insert order into `orders` table
        const orderQuery = `
            INSERT INTO orders (userId, totalAmount, paymentMethod, address)
            VALUES (?, ?, ?, ?)
        `;
        const [orderResult] = await db.promise().execute(orderQuery, [userId, totalAmount, paymentMethod, address]);

        const orderId = orderResult.insertId;

        // Insert each item into `order_items` table
        const itemQueries = cartItems.map(item => {
            return db.promise().execute(
                `INSERT INTO order_items (orderId, productId, quantity, pricePerDay) VALUES (?, ?, ?, ?)`,
                [orderId, item.productId, item.quantity, item.pricePerDay]
            );
        });

        await Promise.all(itemQueries);

        return res.status(201).json({ success: true, message: "Order placed successfully", orderId });
    } catch (error) {
        console.error("Order placement error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Fetch all orders by a user
router.get("/user-orders/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT o.orderId, o.totalAmount, o.paymentMethod, o.orderDate, o.status, o.address,
                   oi.productId, oi.quantity, oi.pricePerDay
            FROM orders o
            JOIN order_items oi ON o.orderId = oi.orderId
            WHERE o.userId = ?
            ORDER BY o.orderDate DESC
        `;

        const [orders] = await db.promise().execute(query, [userId]);

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
