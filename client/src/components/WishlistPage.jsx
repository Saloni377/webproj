import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import "./WishlistPage.css";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]); // Add cart state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState({}); // Track removal state for individual items
  const navigate = useNavigate();
  const userId = 1; // Replace with actual logged-in user ID

  // Fetch wishlist and cart items
  useEffect(() => {
    fetch(`http://localhost:5000/api/wishlist/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setWishlist(data.wishlist || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Wishlist fetch error:", err);
        setError("Failed to fetch wishlist items.");
        setLoading(false);
      });

    fetch(`http://localhost:5000/api/cart/${userId}`)
      .then((response) => response.json())
      .then((data) => setCart(data.cart || []))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [userId]);

  // Handle adding item to shopping bag (cart)
  const handleAddToBag = async (item) => {
    // Check if the item is already in the cart
    const itemInCart = cart.find((cartItem) => cartItem.productId === item.productId);

    if (itemInCart) {
      alert("⚠️ This item is already in your shopping bag.");
      return;
    }

    // Check if the item is in stock on the client side
    if (item.stockQuantity <= 0) {
      alert("⚠️ This product is out of stock and cannot be added to the bag.");
      return;
    }

    try {
      // Add item to cart
      const addResponse = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: item.productId, quantity: 1 }),
      });

      if (addResponse.ok) {
        const data = await addResponse.json();
        alert(`🛍️ ${item.productName} added to your bag!`);
        console.log("Added to cart:", data);

        // Update stock quantity on the server
        const updatedStockQuantity = item.stockQuantity - 1;
        const stockResponse = await fetch(`http://localhost:5000/api/product/${item.productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stockQuantity: updatedStockQuantity }),
        });

        if (stockResponse.ok) {
          // Update cart state and navigate to the shopping bag
          setCart([...cart, { productId: item.productId, quantity: 1 }]);
          navigate("/bag"); // Navigate to the shopping bag page
        } else {
          alert("❌ Failed to update stock. Please try again.");
        }
      } else {
        const errorData = await addResponse.json();
        if (errorData.message.includes("out of stock")) {
          alert("⚠️ Not enough stock available. Please try a smaller quantity.");
        } else {
          alert("❌ Failed to add item to the bag. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding item to bag:", error);
      alert("❌ An error occurred. Please try again.");
    }
  };
  const handleRemoveFromWishlist = async (productId) => {
    if (!userId) {
      console.error("User ID is missing. Cannot remove item from wishlist.");
      return;
    }
  
    setRemoving((prevState) => ({ ...prevState, [productId]: true })); // Set loading state
  
    try {
      const response = await fetch("http://localhost:5000/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }), // Send required data
      });
  
      const result = await response.json(); // Parse JSON response
  
      if (response.ok) {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item.productId !== productId));
      } else {
        console.error("Failed to remove item:", result.message);
        alert("❌ Failed to remove item from wishlist.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("❌ An error occurred. Please try again.");
    } finally {
      setRemoving((prevState) => ({ ...prevState, [productId]: false }));
    }
  };
  

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-container">
          {wishlist.map((item) => (
            <div key={item.productId} className="wishlist-item">
              <div className="wishlist-image">
                <img
                  src={`http://localhost:5000/images/${item.imageUrl}`}
                  alt={item.productName}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
              </div>

              <div className="wishlist-details">
                <h3>{item.productName}</h3>
                <p>{item.description}</p>
                <p className={`availability ${Number(item.stockQuantity) > 0 ? "available" : "out-of-stock"}`}>
                  {Number(item.stockQuantity) > 0 ? `✅ In Stock (${item.stockQuantity})` : "❌ Out of Stock"}
                </p>

                <button
                  className="add-to-bag-btn"
                  onClick={() => handleAddToBag(item)}
                  disabled={item.stockQuantity <= 0}
                >
                  Add to shopping bag
                </button>
              </div>

              <div className="wishlist-price">
                <p>${Number(item.pricePerDay).toFixed(2)}</p>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  disabled={removing[item.productId]} // Disable while removing
                >
                  {removing[item.productId] ? "Removing..." : <Trash2 size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
