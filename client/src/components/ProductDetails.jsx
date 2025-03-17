import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

// Modal component
const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleWishlistClick = async () => {
    if (!product) {
      alert("Product data not loaded. Please try again.");
      return;
    }

    try {
      const wishlistResponse = await fetch("http://localhost:5000/api/wishlist");
      const wishlist = await wishlistResponse.json();

      const alreadyInWishlist = wishlist.some((item) => item.ProductID === product.ProductID);

      if (alreadyInWishlist) {
        setMessage("⚠️ Product already in wishlist!");
      } else {
        const addResponse = await fetch("http://localhost:5000/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });

        if (addResponse.ok) {
          
          setMessage("✅ Added to wishlist! Stock updated.");
        } else {
          setMessage("❌ Failed to add to wishlist. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error handling wishlist action:", error);
      setMessage("❌ An error occurred. Please try again.");
    } finally {
      setShowModal(true);
    }
  };

  const handleAddToCartClick = async () => {
    if (!product) {
      alert("Product data not loaded. Please try again.");
      return;
    }
  
    if (product.StockQuantity <= 0) {
      setMessage("⚠️ Product is out of stock and cannot be added to bag.");
      setShowModal(true);
      return;
    }
  
    try {
      // Check if product already in bag
      const bagResponse = await fetch("http://localhost:5000/api/bag");
      const bag = await bagResponse.json();
  
      const alreadyInBag = bag.some((item) => item.ProductID === product.ProductID);
  
      if (alreadyInBag) {
        setMessage("⚠️ Product already in bag!");
      } else {
        // Add product to bag
        const addResponse = await fetch("http://localhost:5000/api/bag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
  
        if (addResponse.ok) {
          // Update stock quantity after adding to bag
          await updateStockQuantity(product.ProductID, product.StockQuantity - 1);
          setProduct((prevProduct) => ({
            ...prevProduct,
            StockQuantity: prevProduct.StockQuantity - 1,
          }));
          setMessage("✅ Added to bag! Stock updated.");
        } else {
          setMessage("❌ Failed to add to bag. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error handling bag action:", error);
      setMessage("❌ An error occurred. Please try again.");
    } finally {
      setShowModal(true);
    }
  };

  const updateStockQuantity = async (productId, newQuantity) => {
    try {
      const updateResponse = await fetch(`http://localhost:5000/api/product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ StockQuantity: newQuantity }),
      });

      if (updateResponse.ok) {
        setProduct((prevProduct) => ({ ...prevProduct, StockQuantity: newQuantity }));
      }
    } catch (error) {
      console.error("Error updating stock quantity:", error);
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-details">
          <div className="product-image">
            <img
              src={`http://localhost:5000/images/${product.ImageURL}`}
              alt={product.productName}
              className="image"
            />
          </div>

          <div className="product-info">
            <h2 className="product-title">{product.productName}</h2>
            <p className="product-category">Category: {product.Category}</p>
            <p className="product-description">{product.Description}</p>
            <p className="product-price">Price: ${product.PricePerDay} / day</p>
            

            <div className="product-actions">
              <button className="wishlist-btn" onClick={handleWishlistClick}>
                Add to Wishlist
              </button>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCartClick}
                disabled={product.StockQuantity <= 0}
              >
                Add to Cart
              </button>
            </div>

            <div className="delivery-info">
              <p>🚚 Free delivery within 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <Modal message={message} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ProductDetails;
