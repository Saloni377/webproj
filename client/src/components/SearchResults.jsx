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
      {error && <p className="error-message">Error: {error}</p>}

      <div className="product-grid">
        {results.length > 0 ? (
          results.map((product) => (
            <div
              key={product.ProductID}
              className="product-card"
              onClick={() => navigate(`/product/${product.ProductID}`)}
            >
              <a href={`/product/${product.ProductID}`}>
                <img 
                  src={`http://localhost:5000/images/${product.ImageURL}`} 
                  alt={product.productName} 
                  onClick={() => navigate(`/product/${product.ProductID}`)}
                  onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                />
              </a>
              <h3>{product.productName}</h3>
              <p>{product.Description}</p>
              <p className="product-price">${product.PricePerDay}</p>
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