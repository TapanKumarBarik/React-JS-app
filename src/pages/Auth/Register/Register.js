// src/pages/Auth/Register/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import "./Register.css";

function Register() {
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    age: "",
    gender: "",
    country: "",
    is_active: true,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert age to number since it's coming from an input field
      const formData = {
        ...userData,
        age: userData.age ? parseInt(userData.age) : null,
      };

      await api.register(formData);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        if (error.response.data.detail === "Email already registered") {
          alert("Email is already registered");
        } else if (error.response.data.detail === "Username already taken") {
          alert("Username is already taken");
        } else {
          alert("Registration failed. Please try again.");
        }
      }
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          required
          minLength="8"
        />
        <input
          type="number"
          placeholder="Age"
          value={userData.age}
          onChange={(e) => setUserData({ ...userData, age: e.target.value })}
        />
        <select
          value={userData.gender}
          onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Country"
          value={userData.country}
          onChange={(e) =>
            setUserData({ ...userData, country: e.target.value })
          }
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
