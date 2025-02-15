import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchNavbar from "./components/SearchNavbar"; // New Navbar for search results
import Home from "./pages/Home";
import SearchResults from "./components/SearchResults";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

// ✅ Fix: Remove Navbar from Register Page
const MainLayout = ({ onSectionClick }) => {
  const location = useLocation(); // Get current route

  if (location.pathname === "/register") {
    return null; // No navbar on the register page
  } else if (location.pathname === "/search") {
    return <SearchNavbar />;
  } else {
    return <Navbar onSectionClick={onSectionClick} />;
  }
};

export default App;
