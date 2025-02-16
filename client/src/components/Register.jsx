import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userPhoneNumber: "",
    userEmail: "",
    userAddress: "",
    userPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { userName, userPhoneNumber, userEmail, userPassword } = formData;
    if (!userName || !userPhoneNumber || !userEmail || !userPassword) {
      setError("All fields are required.");
      return false;
    }
    if (!/^[0-9]{10}$/.test(userPhoneNumber)) {
      setError("Phone number must be 10 digits.");
      return false;
    }
    if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(userEmail)) {
      setError("Invalid email format.");
      return false;
    }
    if (userPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Registration Successful!");
        navigate("/");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="userName" placeholder="Full Name" value={formData.userName} onChange={handleChange} required />
        <input type="tel" name="userPhoneNumber" placeholder="Phone Number" value={formData.userPhoneNumber} onChange={handleChange} required />
        <input type="email" name="userEmail" placeholder="Email Address" value={formData.userEmail} onChange={handleChange} required />
        <input type="text" name="userAddress" placeholder="Address" value={formData.userAddress} onChange={handleChange} required />
        <input type="password" name="userPassword" placeholder="Password" value={formData.userPassword} onChange={handleChange} required />
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <button onClick={() => navigate("/")} className="back-btn">Back to Home</button>
    </div>
  );
};

export default Register;
