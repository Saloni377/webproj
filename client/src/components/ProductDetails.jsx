import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch product details");
        return response.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="product-details-container">

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      
      {product && (
        <div className="product-details">
          <img src={`http://localhost:5000${product.ImageURL}`} alt={product.productName} />
          <h2>{product.productName}</h2>
          <p>{product.Description}</p>
          <p className="product-price">Price: ${product.PricePerDay}</p>
          <p className="product-availability">
            Availability: {product.Availability ? "In Stock" : "Out of Stock"}
          </p>

          <button className="wishlist-button">Add to Wishlist ❤️</button>
          <button className="cart-button">Add to Cart 🛒</button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
