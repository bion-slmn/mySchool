import React, { useState, useEffect } from "react";
import "../styles/navbar.css";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { fetchData } from "./form";
import RotatingIcon from "./loadingIcon";
import { Dropdown } from "../pages/home";
const DisplayUserInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { checkTokenAndRefresh } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true); // Moved here inside useEffect
      let [data, error] = await fetchData(
        "GET",
        "api/user/get-user-info/",
        checkTokenAndRefresh
      );
      setIsLoading(false);
      if (data) {
        setData(data);
      } else {
        setError(error);
      }
    };
    fetchUserInfo();
  }, []);

  if (isLoading) {
    return <RotatingIcon />;
  }

  if (error) return <p>{error}</p>;

  if (!data) return <p>No user info available</p>;

  return (
    <div className="navbar-user-info">
      <span className="user-name">{data.first_name || data.email}</span>
      <span className="school-name">{data.role}</span>
      <span className="school-name">{data.school_name}</span>
    </div>
  );
};

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const user = useAuth();
  const [register, setRegister] = useState(false);

  // Check localStorage when the component mounts
  useEffect(() => {
    if (user.token) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const handleLogin = () => {
    // Logic to log in the user
    navigate("/login");
  };

  const handleLogout = () => {
    // Logic to log out the user
    setIsLoggedIn(false);
    user.logOut();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const seeRegister = () => {
    setRegister(!register);
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
          <div className="dropdown-nav">
            <button onClick={seeRegister} className="seeRegister">
              Register ...
            </button>
            {register && (
              <div className="dropdown-menu" onClick={() => setRegister(false)}>
                <Dropdown />
              </div>
            )}
            <button className="user-icon" onClick={toggleDropdown}>
              <FaUser />
            </button>
            {showDropdown && (
              <div className="dropdown-menu-nav">
                <DisplayUserInfo />
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
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
