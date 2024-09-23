import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [schoolUser, setSchoolUser] = useState({});
  const navigate = useNavigate();
  const user = useAuth();
  // Check localStorage when the component mounts
  useEffect(() => {
    if (user.token) {
      setIsLoggedIn(true);
      setSchoolUser(JSON.parse(localStorage.getItem("sHule_user")));
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    // Logic to log in the user
    navigate("/login");
  };

  const handleLogout = () => {
    // Logic to log out the user
    user.logOut();
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
          <>
            <p>{schoolUser.school}</p>
            <button onClick={handleLogout} className="user-icon">
              Logout
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="user-icon">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
