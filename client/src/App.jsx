import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchNavbar from "./components/SearchNavbar"; // New Navbar for search results
import Home from "./pages/Home";
import SearchResults from "./components/SearchResults";

function App() {
  const [highlightSection, setHighlightSection] = useState("");

  return (
    <Router>
      <MainLayout onSectionClick={setHighlightSection} />
      <Routes>
        <Route path="/" element={<Home highlightSection={highlightSection} />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}


// Separate component to determine which Navbar to show
const MainLayout = ({ onSectionClick }) => {
  const location = useLocation(); // Get current route

  return location.pathname === "/search" ? <SearchNavbar /> : <Navbar onSectionClick={onSectionClick} />;
};

export default App;
