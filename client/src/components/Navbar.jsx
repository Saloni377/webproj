import React, { useState, useEffect } from "react";
import { FaSignInAlt, FaTimes, FaStar, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Track logged-in user
  const navigate = useNavigate();

  // Load user from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleLogin = () => {
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login Successful!");

          // Save user to localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user); // Update state
          
          setShowModal(false);
        } else {
          alert("Invalid email or password!");
        }
      })
      .catch((err) => alert("Error logging in!"));
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from storage
    setUser(null); // Reset user state
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Brand Logo" />
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>

        <ul className="nav-links">
          <li>
            <button className="nav-btn" onClick={() => navigate("/about")}>
              <FaStar /> About Us
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/features")}>
              <FaStar /> Features
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/reviews")}>
              Reviews
            </button>
          </li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/contact")}>
              <FaEnvelope /> Contact Us
            </button>
          </li>

          {/* Show "Your Orders" button if logged in, otherwise show "Sign In" */}
          {user ? (
            <>
              <li>
                <button className="nav-btn" onClick={() => navigate("/orders")}>
                  🛒 Your Orders
                </button>
              </li>
              <li>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button className="signin-btn" onClick={() => setShowModal(true)}>
                <FaSignInAlt /> Sign In
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Login Modal */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="signin-modal">
            <FaTimes className="close-modal" onClick={() => setShowModal(false)} />
            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-btn" onClick={handleLogin}>
              LOGIN
            </button>

            <p className="toggle-text">
              Not a member?{" "}
              <span
                onClick={() => {
                  setShowModal(false); // Close the modal
                  navigate("/register"); // Navigate to Register
                }}
                className="toggle-link"
              >
                Sign up now
              </span>
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
