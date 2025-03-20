import React, { useState, useEffect } from "react";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/user-orders/${userId}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.orderId} className="order-card">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Ordered On:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              
              {/* Order Actions */}
              <div className="order-actions">
                <button className="btn-reorder">Review</button>
                <button className="btn-cancel">Cancel</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
