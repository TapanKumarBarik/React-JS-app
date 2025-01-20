import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your personal workspace</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Expenses Overview</h3>
          <div className="card-content">
            <p>Total Expenses: $0</p>
            <p>This Month: $0</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Active Groups</h3>
          <div className="card-content">
            <p>Total Groups: 0</p>
            <p>Recent Activity: None</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Todo List</h3>
          <div className="card-content">
            <p>Pending Tasks: 0</p>
            <p>Completed: 0</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Notes</h3>
          <div className="card-content">
            <p>Total Notes: 0</p>
            <p>Recent Updates: None</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
