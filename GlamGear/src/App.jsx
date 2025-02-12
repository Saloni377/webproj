import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features"; // Ensure this import is correct
import Reviews from "./pages/Reviews";
import Search from "./pages/Search";
import Signin from "./pages/Signin";

function App() {
  const aboutSectionRef = useRef(null);

  const handleHomeClick = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      aboutSectionRef.current.classList.add('highlight');

      setTimeout(() => {
        aboutSectionRef.current.classList.remove('highlight');
      }, 2000);
    }
  };

  return (
    <Router>
      <Navbar onHomeClick={handleHomeClick} />

      <Routes>
        <Route path="/" element={<Home aboutSectionRef={aboutSectionRef} />} />
        <Route path="/features" element={<Features />} /> {/* Displays products */}
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;