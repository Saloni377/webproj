import React, { useState } from "react";
import { FaSignInAlt, FaTimes, FaStar, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleLogin = () => {
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login Successful!");
          setShowModal(false);
        } else {
          alert("User not found! Please sign up.");
          navigate("/register"); // Redirects to registration page
        }
      })
      .catch((err) => alert("Error logging in!"));
  };

  const onSectionClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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
            <button onClick={() => onSectionClick("about")} className="nav-btn">
              <FaStar /> About Us
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionClick("features")}
              className="nav-btn"
            >
              <FaStar /> Features
            </button>
          </li>
          <li>
            <button onClick={() => onSectionClick("reviews")} className="nav-btn">
              Reviews
            </button>
          </li>
          <li>
            <button onClick={() => onSectionClick("contact")} className="nav-btn">
              <FaEnvelope /> Contact Us
            </button>
          </li>
          <li>
            <button className="signin-btn" onClick={() => setShowModal(true)}>
              <FaSignInAlt /> Sign In
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal Popup */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="signin-modal">
            <FaTimes className="close-modal" onClick={() => setShowModal(false)} />
            <h2>Login Form</h2>

            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <a href="#" className="forgot-password">
              Forgot Password?
            </a>

            <button className="login-btn" onClick={handleLogin}>
              LOGIN
            </button>

            <p className="toggle-text">
              Not a member?{" "}
              <span
                onClick={() => {
                 setShowModal(false); // Close the modal
                 navigate("/register"); // Navigate to the Register page
              }}
              className="toggle-link">
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
