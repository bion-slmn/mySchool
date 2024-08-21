import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check localStorage when the component mounts
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  }, []);

  const handleLogin = () => {
    // Logic to log in the user
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/login");
  };

  const handleLogout = () => {
    // Logic to log out the user
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          sHule
        </Link>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="user-icon">
            Logout
          </button>
        ) : (
          <button onClick={handleLogin} className="user-icon">
            Login
          </button>
        )}
        <Link to="/account" className="user-icon">
          <FaUser className="user" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
