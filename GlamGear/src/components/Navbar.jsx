import React from "react";
import { FaHome, FaStar, FaSearch, FaSignInAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = ({ onHomeClick, onFeaturesClick }) => {
  const openSignInWindow = () => {
    window.open("/signin", "_blank", "width=600,height=600");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Brand Logo" />
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button><FaSearch /></button>
      </div>

      <ul className="nav-links">
        <li>
          <button onClick={onHomeClick} className="nav-btn"><FaHome /> Home</button>
        </li>
        <li>
          <button onClick={() => {
            onFeaturesClick();
            document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
            const section = document.querySelector('.products-section');
            section.classList.add('highlight-border');
            setTimeout(() => section.classList.remove('highlight-border'), 2000);
          }} className="nav-btn"><FaStar /> Features</button>
        </li>
        <li>
          <button className="nav-btn">Reviews</button>
        </li>
        <li>
          <button onClick={openSignInWindow} className="signin-btn">
            <FaSignInAlt /> Sign In
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;