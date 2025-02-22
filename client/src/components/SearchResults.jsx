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
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>

      {loading && <p>Loading results...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      <div className="product-grid">
        {results.length > 0 ? (
          results.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.ProductID}`)} // Navigate to Product Details
            >
              <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>
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
