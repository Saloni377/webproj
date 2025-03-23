import React, { useState, useEffect } from "react";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [reviewsState, setReviewsState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (orderId, field, value) => {
    setReviewsState((prevState) => ({
      ...prevState,
      [orderId]: {
        ...prevState[orderId],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (orderId, productId, e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const { review, rating } = reviewsState[orderId] || { review: "", rating: 1 };
  
    if (!review.trim()) {
      alert("Please write a review.");
      setIsSubmitting(false);
      return;
    }
  
    const requestData = { orderId, productId, review, rating, userId };
  
    console.log("Sending review data:", requestData);  // Log before sending
  
    try {
      const response = await fetch("http://localhost:5000/api/reviews/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log("Server Response:", data);  // Log the response
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${data.message || "Unknown error"}`);
      }
  
      if (data.success) {
        alert("Review submitted successfully!");
        setReviewsState((prev) => ({
          ...prev,
          [orderId]: { review: "", rating: 1 },
        }));
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={`${order.orderId}-${order.productId}`} className="order-card">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Ordered On:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              
              <div className="order-actions">
                <button className="btn-reorder">Reorder</button>
                <button className="btn-cancel">Cancel</button>
              </div>

              <div className="review-form">
                <h4>Write a Review for Order ID: {order.orderId}</h4>
                <form onSubmit={(e) => handleSubmitReview(order.orderId, order.productId, e)}>
                  <div className="form-group">
                    <label htmlFor={`rating-${order.orderId}`}>Rating:</label>
                    <select
                      id={`rating-${order.orderId}`}
                      value={reviewsState[order.orderId]?.rating || 1}
                      onChange={(e) => handleInputChange(order.orderId, "rating", Number(e.target.value))}
                      required
                    >
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`review-${order.orderId}`}>Review:</label>
                    <textarea
                      id={`review-${order.orderId}`}
                      value={reviewsState[order.orderId]?.review || ""}
                      onChange={(e) => handleInputChange(order.orderId, "review", e.target.value)}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;