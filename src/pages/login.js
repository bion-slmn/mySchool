import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import "../styles/login.css";
import { useFormSubmit } from "../Components/form";

const Button = ({ text }) => {
  return <button type="submit">{text}</button>;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation

  // Get the redirect location or default to /dashboard
  const redirectPath = location.state?.from?.pathname || "/";

  const { handleSubmit, error } = useFormSubmit(
    "http://localhost:8000/api/user/login/",
    { email, password },
    () => {
      // Handle successful login, navigate to the redirect path
      navigate(redirectPath);
    }
  );

  return (
    <div className="login-page">
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
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

export default Login;
