import React, { useState } from "react";
import { FaStar, FaSearch, FaSignInAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = ({ onSectionClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
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
        <button onClick={handleSearch}><FaSearch /></button>
      </div>

      <ul className="nav-links">
        <li><button onClick={() => onSectionClick('about')} className="nav-btn"><FaStar /> About Us</button></li>
        <li><button onClick={() => onSectionClick('features')} className="nav-btn"><FaStar /> Features</button></li>
        <li><button onClick={() => onSectionClick('reviews')} className="nav-btn">Reviews</button></li>
        <li><button onClick={() => onSectionClick('contact')} className="nav-btn"><FaEnvelope /> Contact Us</button></li>
        <li><button className="signin-btn"><FaSignInAlt /> Sign In</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
