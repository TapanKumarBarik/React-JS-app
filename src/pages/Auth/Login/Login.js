// src/pages/Auth/Login/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import "./Login.css";
import Swal from "sweetalert2";

function Login({ setIsAuthenticated }) {
  // Add setIsAuthenticated prop
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login(credentials);
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        // Get user profile after successful login
        const userProfile = await api.getCurrentUser(response.access_token);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        setIsAuthenticated(true); // Set authentication state to true
        navigate("/expenses"); // Redirect to expenses page explicitly
      }
    } catch (error) {
      if (error.response?.data?.detail === "Incorrect username or password") {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid username or password",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Please try again later",
          confirmButtonColor: "#3085d6",
        });
      }
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
