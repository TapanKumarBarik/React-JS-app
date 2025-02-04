import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import Swal from "sweetalert2";
import "./Todos.css";

import { useNavigate } from "react-router-dom";

function Todos() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "new",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const todosList = await api.todos.getActive(token);
      setTodos(todosList);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch todos");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.todos.create(newTodo, token);
      setNewTodo({ title: "", description: "", due_date: "", status: "new" });
      setShowModal(false);
      fetchTodos();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Todo created successfully",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
        toast: true,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create todo",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleStatusUpdate = async (todoId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const todo = todos.find((t) => t.id === todoId);
      const updateData = {
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        status: newStatus,
      };
      await api.todos.update(todoId, updateData, token);
      fetchTodos();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update todo status",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleDelete = async (todoId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await api.todos.delete(todoId, token);
        fetchTodos();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Todo has been deleted.",
          showConfirmButton: false,
          timer: 1500,
          position: "top-end",
          toast: true,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete todo",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todos-page">
      <div className="todos-header">
        <h1>Todo List</h1>
        <div className="todos-actions">
          <button
            className="view-completed-btn"
            onClick={() => navigate("/todos/completed")}
          >
            View Completed Todos
          </button>
        </div>
      </div>

      <div className="todos-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos yet</h3>
            <p>Click the + button to create your first todo</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div className="todo-content">
                <div className="todo-title">{todo.title}</div>
                {todo.description && (
                  <div className="todo-description">{todo.description}</div>
                )}
                <div className="todo-meta">
                  Created: {new Date(todo.created_at).toLocaleDateString()}
                  {todo.due_date &&
                    ` | Due: ${new Date(todo.due_date).toLocaleDateString()}`}
                </div>
              </div>
              <div className="todo-actions">
                <select
                  value={todo.status}
                  onChange={(e) => handleStatusUpdate(todo.id, e.target.value)}
                  className={`todo-status status-${todo.status}`}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="fab-button" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Add New Todo</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  required
                  maxLength="200"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  value={newTodo.due_date}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, due_date: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  maxLength="500"
                  rows="3"
                />
              </div>
              <button type="submit" className="submit-btn">
                Add Todo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Todos;
