import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import "./BagPage.css";

const BagPage = () => {
  const [bag, setBag] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bag items
  useEffect(() => {
    fetch("http://localhost:5000/api/bag")
      .then((response) => response.json())
      .then((data) => {
        setBag(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch bag items.");
        setLoading(false);
      });
  }, []);

  // Remove item from bag
  const handleRemoveFromBag = (id) => {
    fetch(`http://localhost:5000/api/bag/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setBag(bag.filter((item) => item.ProductID !== id));
      })
      .catch(() => alert("Failed to remove item from bag."));
  };

  // Update item quantity
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;

    fetch(`http://localhost:5000/api/bag/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Quantity: newQuantity }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setBag(bag.map((item) => (item.ProductID === id ? updatedItem : item)));
      })
      .catch(() => alert("Failed to update item quantity."));
  };

  // Calculate total price
  const calculateTotal = () => {
    return bag
      .reduce((total, item) => total + item.PricePerDay * item.Quantity, 0)
      .toFixed(2);
  };

  if (loading) return <p>Loading bag...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bag-page">
      <h1>Your Shopping Bag</h1>
      {bag.length === 0 ? (
        <p>Your bag is empty.</p>
      ) : (
        <div className="bag-container">
          {bag.map((item) => (
            <div key={item.ProductID} className="bag-item">
              <div className="bag-image">
                <img
                  src={`http://localhost:5000/images/${item.ImageURL}`}
                  alt={item.productName}
                />
              </div>

              <div className="bag-details">
                <h3>{item.productName}</h3>
                <p>{item.Description}</p>
                <p>Price per day: ${Number(item.PricePerDay).toFixed(2)}</p>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.ProductID, item.Quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.Quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.ProductID, item.Quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bag-actions">
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromBag(item.ProductID)}
                >
                  <Trash2 size={20} /> Remove
                </button>
              </div>
            </div>
          ))}

          <div className="bag-total">
            <h2>Total: ${calculateTotal()}</h2>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagPage;
