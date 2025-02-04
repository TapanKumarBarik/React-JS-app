// src/pages/Todos/CompletedTodos.js
import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./Todos.css";

function CompletedTodos() {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompletedTodos();
  }, []);

  const fetchCompletedTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const todosList = await api.todos.getCompleted(token);
      setCompletedTodos(todosList);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch completed todos");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todos-page">
      <div className="todos-header">
        <h1>Completed Todos</h1>
      </div>

      <div className="todos-list">
        {completedTodos.length === 0 ? (
          <div className="empty-state">
            <h3>No completed todos</h3>
            <p>Complete some todos to see them here</p>
          </div>
        ) : (
          completedTodos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div className="todo-content">
                <div className="todo-title">{todo.title}</div>
                {todo.description && (
                  <div className="todo-description">{todo.description}</div>
                )}
                <div className="todo-meta">
                  Completed: {new Date(todo.updated_at).toLocaleDateString()}
                  {todo.due_date &&
                    ` | Due: ${new Date(todo.due_date).toLocaleDateString()}`}
                </div>
              </div>
              <div className="todo-status status-completed">Completed</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CompletedTodos;
