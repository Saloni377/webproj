import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WishlistPage.css";
import { Trash2 } from "lucide-react";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch wishlist items
  useEffect(() => {
    fetch("http://localhost:5000/api/wishlist")
      .then((response) => response.json())
      .then((data) => {
        setWishlist(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch wishlist items.");
        setLoading(false);
      });
  }, []);

  // Handle adding item to bag
  const handleAddToBag = async (item) => {
    if (item.StockQuantity <= 0) {
      alert("⚠️ This product is out of stock and cannot be added to the bag.");
      return;
    }

    try {
      const addResponse = await fetch("http://localhost:5000/api/bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (addResponse.ok) {
        await fetch(`http://localhost:5000/api/product/${item.ProductID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ StockQuantity: item.StockQuantity - 1 }),
        });

        setWishlist((prevWishlist) =>
          prevWishlist.map((product) =>
            product.ProductID === item.ProductID
              ? { ...product, StockQuantity: product.StockQuantity - 1 }
              : product
          )
        );

        alert(`${item.productName} added to your bag! Stock updated.`);
        navigate("/bag");
      } else {
        alert("❌ Failed to add item to bag. Please try again.");
      }
    } catch (error) {
      console.error("Error adding item to bag:", error);
      alert("❌ An error occurred. Please try again.");
    }
  };

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = (id) => {
    fetch(`http://localhost:5000/api/wishlist/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setWishlist(wishlist.filter((item) => item.ProductID !== id));
      })
      .catch(() => alert("Failed to remove item from wishlist."));
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
            <div key={item.ProductID} className="wishlist-item">
              <div className="wishlist-image">
                <img
                  src={`http://localhost:5000/images/${item.ImageURL}`}
                  alt={item.productName}
                />
              </div>

              <div className="wishlist-details">
                <h3>{item.productName}</h3>
                <p>{item.Description}</p>
                <p className={`availability ${item.StockQuantity > 0 ? "available" : "out-of-stock"}`}>
                  {item.StockQuantity > 0 ? `✅ In Stock (${item.StockQuantity})` : "❌ Out of Stock"}
                </p>

                <button
                  className="add-to-bag-btn"
                  onClick={() => handleAddToBag(item)}
                  disabled={item.StockQuantity <= 0}
                >
                  Add to shopping bag
                </button>
              </div>

              <div className="wishlist-price">
                <p>${Number(item.PricePerDay).toFixed(2)}</p>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWishlist(item.ProductID)}
                >
                  <Trash2 size={20} />
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
