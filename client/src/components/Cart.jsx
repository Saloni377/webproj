import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import "./Cart.css";  // Make sure to add CSS styling for the page

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 1; // Example userId, replace with dynamic user ID based on the session or authentication

  // Fetch cart items
  useEffect(() => {
    fetch(`http://localhost:5000/api/cart/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCartItems(data.cart);
        } else {
          setError("Failed to fetch cart items.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch cart items.");
        setLoading(false);
      });
  }, [userId]);

  // Remove item from cart
  const handleRemoveFromCart = (cartId) => {
    fetch(`http://localhost:5000/api/cart/${cartId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCartItems(cartItems.filter((item) => item.cartId !== cartId));
        } else {
          alert("Failed to remove item from cart.");
        }
      })
      .catch(() => {
        alert("Failed to remove item from cart.");
      });
  };
   
  const handleQuantityChange = async (cartId, newQuantity) => {
    try {
        const response = await fetch("http://localhost:5000/api/cart/update-quantity", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartId, newQuantity }),
        });

        const data = await response.json();
        if (response.ok) {
            setCartItems((prevCart) =>
                prevCart.map((item) =>
                    item.cartId === cartId ? { ...item, quantity: newQuantity } : item
                )
            );
        } else {
            alert(data.message || "Failed to update quantity.");
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        alert("Error updating quantity. Please try again.");
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.pricePerDay * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) return <p>Loading your cart...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          {cartItems.map((item) => (
            <div key={item.cartId} className="cart-item">
              <div className="cart-image">
                <img
                  src={`http://localhost:5000/images/${item.imageUrl}`}
                  alt={item.productName}
                />
              </div>

              <div className="cart-details">
                <h3>{item.productName}</h3>
                <p>{item.description}</p>
                <p>Price per day: ${Number(item.pricePerDay).toFixed(2)}</p>

                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                    disabled={item.quantity <= 1} // Disable if quantity is 1
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-actions">
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item.cartId)}
                >
                  <Trash2 size={20} /> Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: ${calculateTotal()}</h2>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
