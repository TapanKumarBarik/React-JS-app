import React from "react";
import { useNavigate } from "react-router-dom";
import "./Preview.css";

function Preview() {
  const navigate = useNavigate();

  return (
    <div className="preview-container">
      <header className="preview-header">
        <h1>Personal Management Hub</h1>
        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </header>

      <main className="preview-content">
        <section className="hero-section">
          <h2>Organize Your Life in One Place</h2>
          <p>Track expenses, manage groups, take notes, and stay productive</p>
        </section>

        <section className="features">
          <div className="feature-card">
            <h3>Expense Tracking</h3>
            <p>Keep track of your spending and stay within budget</p>
          </div>

          <div className="feature-card">
            <h3>Group Management</h3>
            <p>Collaborate and organize with your teams effectively</p>
          </div>

          <div className="feature-card">
            <h3>Note Taking</h3>
            <p>Capture your thoughts and ideas instantly</p>
          </div>

          <div className="feature-card">
            <h3>Todo Lists</h3>
            <p>Stay on top of your tasks and boost productivity</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Preview;
