import React, { useState } from "react";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Handle successful login, e.g., redirect or update UI
    } catch (error) {
      console.error("Error during login:", error);
      // Handle errors, e.g., show error message to user
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to sHule ....</h1>
      <form onSubmit={handleLogin} className="LoginForm">
        <h3>Let's Login</h3>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
