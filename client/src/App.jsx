import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchNavbar from "./components/SearchNavbar";
import Home from "./pages/Home";
import SearchResults from "./components/SearchResults";
import Register from "./components/Register";
import ProductDetails from "./components/ProductDetails";
import WishlistPage from "./components/WishlistPage";
import BagPage from "./components/BagPage";



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
      <MainLayout user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/bag" element={<BagPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<cart/>} />
      </Routes>
    </Router>
  );
}

// ✅ Fix: Show Navbar only on allowed pages
const MainLayout = ({ user, setUser }) => {
  const location = useLocation();

  if (location.pathname === "/register") {
    return null; // No navbar on Register page
  }
  else {
    return <Navbar user={user} setUser={setUser} />;
  }
};

export default App;
