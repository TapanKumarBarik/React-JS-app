import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ username, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">Your App</div>
      <div className="user-section">
        <span className="username">Welcome, {username}</span>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </header>
  );
}

export default Header;
