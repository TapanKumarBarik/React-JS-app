import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <nav>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Expenses
        </NavLink>
        <NavLink
          to="/groups"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Groups
        </NavLink>
        <NavLink
          to="/notes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Notes
        </NavLink>
        <NavLink
          to="/todos"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Todo List
        </NavLink>
        <NavLink
          to="/problems"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          problems
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
