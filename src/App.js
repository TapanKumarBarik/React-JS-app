// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Home from "./pages/Home/Home";
import Preview from "./pages/Preview/Preview";
import ExpensesPage from "./pages/Expenses/Expenses"; // Fix import path
import GroupsPage from "./pages/Groups/Groups"; // Fix import path
import Notes from "./pages/Notes/Notes";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import GroupDetails from "./pages/Groups/GroupDetails";
import Todos from "./pages/Todos/Todos";
import CompletedTodos from "./pages/Todos/CompletedTodos";
import Problems from "./pages/DSA/Problems";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    !!localStorage.getItem("token")
  );
  const [userProfile, setUserProfile] = React.useState(
    JSON.parse(localStorage.getItem("userProfile")) || {}
  );

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <Header
              username={userProfile.username}
              setIsAuthenticated={setIsAuthenticated}
            />
            <div className="main-container">
              <Sidebar />
              <main className="content">
                <Routes>
                  <Route path="/problems" element={<Problems />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/todos" element={<Todos />} />
                  <Route path="/todos/completed" element={<CompletedTodos />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/groups/:groupId" element={<GroupDetails />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />

            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Preview />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}
export default App;
