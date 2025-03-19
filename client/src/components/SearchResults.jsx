import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/products/search?q=${query}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>

      {loading && <p>Loading results...</p>}
      {error && <p className="error-message">❌ {error}</p>}

      <div className="product-grid">
        {results.length > 0 ? (
          results.map((product) => (
            <div
              key={product.productId}
              className="product-card"
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <img
                src={product.fullImageURL} // Use fullImageURL from API response
                alt={product.productName}
                onError={(e) => {
                  if (!e.target.src.includes("placeholder.jpg")) {
                    e.target.src = "/placeholder.jpg"; // Use a placeholder image in the public folder
                  }
                }}
              />
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.pricePerDay} / day</p>
            </div>
          ))
        ) : (
          !loading && <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
