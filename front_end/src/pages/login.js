import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import "../styles/login.css";
import { useAuth } from "../Components/AuthProvider";

const Button = ({ text }) => {
  return <button type="submit">{text}</button>;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation(); // Initialize useLocation

  const auth = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submiting a login form, email:", email, "password:", password);
    if (email && password) {
      auth.loginAction({ email, password });
    } else {
      alert("please provide a valid input");
    }
  };

  return (
    <div className="login-page">
      console.log(l12121212)
      <h1>Welcome to sHule ....</h1>
      <form onSubmit={handleSubmit} className="LoginForm">
        <h3>Let's Login</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button text="Login" />
      </form>
    </div>
  );
}

export default Login;
